import { Injectable, OnDestroy } from '@angular/core';
import { coerceArray } from '@angular/cdk/coercion';
import { combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, take } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DecodedIndexedTx, TxMessageTypeUrl, TxMessageValue } from 'decentr-js';

import { InfiniteLoadingService } from '@shared/utils/infinite-loading';
import { AuthService } from '@core/auth';
import { BankService, BlocksService, DecentrService, NetworkService } from '@core/services';
import { Asset } from './assets-page.definitions';
import { TokenTransactionMessage } from '../../components/token-transactions-table';
import {
  mapDelegateTransaction,
  mapRedelegateTransaction,
  mapSendTransaction,
  mapUndelegateTransaction,
  mapWithdrawDelegatorReward,
  mapWithdrawValidatorRewardTransaction,
} from './mapping';

@UntilDestroy()
@Injectable()
export class AssetsPageService
  extends InfiniteLoadingService<TokenTransactionMessage>
  implements OnDestroy {

  constructor(
    private authService: AuthService,
    private blocksService: BlocksService,
    private decentrService: DecentrService,
    private networkService: NetworkService,
    private bankService: BankService,
  ) {
    super();

    this.loadMoreItems();
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  public get canLoadMore$(): Observable<boolean> {
    return of(false);
  }

  public getBalance(): Observable<string> {
    return this.bankService.getDECBalance();
  }

  public getAssets(): Observable<Asset[]> {
    return this.getBalance().pipe(
      map((balance) => ([
        {
          balance,
          transactions: combineLatest([
            this.isLoading$,
            this.list$,
          ]).pipe(
            map(([isLoading, list]) => !list.length && isLoading ? undefined : list),
            distinctUntilChanged(),
            map((list) => list && [list]),
          ),
        },
      ])),
    );
  }

  protected getNextItems(): Observable<TokenTransactionMessage[]> {
    return this.searchTransactions().pipe(
      map((transactions) => transactions
        .map((tx) => this.mapTransaction(tx))
        .reduce((acc, messages) => [...acc, ...messages], [])
      ),
    );
  }

  private searchTransactions(): Observable<DecodedIndexedTx[]> {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    return combineLatest([
      this.decentrService.decentrClient.pipe(
        mergeMap((decentrClient) => decentrClient.tx.search({ sentFromOrTo: walletAddress })),
      ),
      this.decentrService.decentrClient.pipe(
        mergeMap((decentrClient) => decentrClient.tx.search({ tags: [
          {
            key: 'message.module',
            value: 'staking',
          },
          {
            key: 'message.sender',
            value: walletAddress,
          },
        ]})),
      ),
      this.decentrService.decentrClient.pipe(
        mergeMap((decentrClient) => decentrClient.tx.search({ tags: [
          {
            key: 'message.module',
            value: 'distribution',
          },
          {
            key: 'message.sender',
            value: walletAddress,
          },
        ]})),
      ),
    ]).pipe(
      map((txArrays) => txArrays.reduce((acc, txs) => [...acc, ...txs], [])),
      map((txs) => txs.filter((tx) => !tx.code)),
      map((txs) => txs.sort((left, right) => right.height - left.height)),
      take(1),
    );
  }

  private mapTransaction(tx: DecodedIndexedTx): TokenTransactionMessage[] {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    return tx.tx.body.messages
      .reduce((acc, msg, msgIndex) => {
        let tokenTransaction: TokenTransactionMessage | TokenTransactionMessage[];

        switch (msg.typeUrl) {
          case TxMessageTypeUrl.BankSend: {
            const msgValue = msg.value as TxMessageValue<TxMessageTypeUrl.BankSend>;

            if (![msgValue.toAddress, msgValue.fromAddress].includes(walletAddress)) {
              break;
            }

            tokenTransaction = mapSendTransaction(msgValue, msgIndex, tx, walletAddress);

            break;
          }

          case TxMessageTypeUrl.DistributionWithdrawDelegatorReward: {
            tokenTransaction = mapWithdrawDelegatorReward(msgIndex, tx, walletAddress);

            break;
          }

          case TxMessageTypeUrl.StakingDelegate: {
            const msgValue = msg.value as TxMessageValue<TxMessageTypeUrl.StakingDelegate>;

            tokenTransaction = mapDelegateTransaction(msgValue, msgIndex, tx, walletAddress);

            break;
          }

          case TxMessageTypeUrl.StakingUndelegate: {
            const msgValue = msg.value as TxMessageValue<TxMessageTypeUrl.StakingUndelegate>;

            tokenTransaction = mapUndelegateTransaction(msgValue, msgIndex, tx, walletAddress);

            break;
          }

          case TxMessageTypeUrl.StakingBeginRedelegate: {
            tokenTransaction = mapRedelegateTransaction(msgIndex, tx, walletAddress);

            break;
          }

          case TxMessageTypeUrl.DistributionWithdrawValidatorCommission: {
            tokenTransaction = mapWithdrawValidatorRewardTransaction(msgIndex, tx, walletAddress);

            break;
          }
        }

        return [...acc, ...tokenTransaction ? coerceArray(tokenTransaction) : []];
      }, []);
  }
}
