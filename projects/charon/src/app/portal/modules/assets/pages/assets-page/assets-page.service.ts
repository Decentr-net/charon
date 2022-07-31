import { Injectable, OnDestroy } from '@angular/core';
import { coerceArray } from '@angular/cdk/coercion';
import { combineLatest, concat, Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, mergeMap, reduce, take } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CosmosTxMessageTypeUrl, DecodedIndexedTx, TxMessageValue, Wallet } from 'decentr-js';

import { InfiniteLoadingService } from '@shared/utils/infinite-loading';
import { AuthService } from '@core/auth';
import { BankService, BlocksService, DecentrService, NetworkService } from '@core/services';
import {
  TokenComplexTransaction,
  TokenSingleTransaction,
  TokenTransaction,
  TokenTransactionMessage,
} from '../../components';
import { Asset } from './assets-page.definitions';
import {
  mapDelegateTransaction,
  mapIbcTransfer,
  mapRedelegateTransaction,
  mapSendTransaction,
  mapUndelegateTransaction,
  mapWithdrawDelegatorReward,
  mapWithdrawValidatorRewardTransaction,
} from './mapping';

@UntilDestroy()
@Injectable()
export class AssetsPageService
  extends InfiniteLoadingService<TokenTransaction>
  implements OnDestroy {

  private loadingFailed: boolean;

  public get isLoadingFailed(): boolean {
    return this.loadingFailed;
  }

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

  public override get canLoadMore$(): Observable<boolean> {
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

  protected getNextItems(): Observable<TokenTransaction[]> {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    return this.searchTransactions(walletAddress).pipe(
      map((transactions) => transactions.map((tx) => this.mapTransaction(tx, walletAddress))),
      map((transactions) => transactions.filter(Boolean)),
      catchError(() => {
        this.loadingFailed = true;
        return of([]);
      }),
    );
  }

  private searchTransactions(walletAddress: Wallet['address']): Observable<DecodedIndexedTx[]> {
    return concat(
      this.decentrService.decentrClient.pipe(
        mergeMap((decentrClient) => decentrClient.tx.search({
          tags: [
            {
              key: 'message.module',
              value: 'bank',
            },
            {
              key: 'transfer.sender',
              value: walletAddress,
            },
          ],
        })),
      ),
      this.decentrService.decentrClient.pipe(
        mergeMap((decentrClient) => decentrClient.tx.search({
          tags: [
            {
              key: 'message.module',
              value: 'bank',
            },
            {
              key: 'transfer.recipient',
              value: walletAddress,
            },
          ],
        })),
      ),
      this.decentrService.decentrClient.pipe(
        mergeMap((decentrClient) => decentrClient.tx.search({
          tags: [
            {
              key: 'message.module',
              value: 'staking',
            },
            {
              key: 'message.sender',
              value: walletAddress,
            },
          ],
        })),
      ),
      this.decentrService.decentrClient.pipe(
        mergeMap((decentrClient) => decentrClient.tx.search({
          tags: [
            {
              key: 'message.module',
              value: 'distribution',
            },
            {
              key: 'message.sender',
              value: walletAddress,
            },
          ],
        })),
      ),
      this.decentrService.decentrClient.pipe(
        mergeMap((decentrClient) => decentrClient.tx.search({
          tags: [
            {
              key: 'message.action',
              value: CosmosTxMessageTypeUrl.IbcMsgTransfer,
            },
            {
              key: 'message.sender',
              value: walletAddress,
            },
          ],
        })),
      ),
    ).pipe(
      reduce((acc, txs) => [...acc, ...txs], []),
      map((txs) => txs.filter((tx, index) => txs.findIndex(({ hash }) => hash === tx.hash) === index)),
      map((txs) => txs.filter((tx) => !tx.code)),
      map((txs) => txs.sort((left, right) => right.height - left.height)),
      take(1),
    );
  }

  private mapTransaction(tx: DecodedIndexedTx, walletAddress: Wallet['address']): TokenTransaction | undefined {
    const fee = +tx.tx.authInfo.fee.amount[0]?.amount || 0;
    const comment = tx.tx.body.memo;

    const mappedMessages: TokenTransactionMessage[] = tx.tx.body.messages
      .reduce((acc, msg, msgIndex) => {
        let tokenTransactionMessage: TokenTransactionMessage | TokenTransactionMessage[];

        switch (msg.typeUrl) {
          case CosmosTxMessageTypeUrl.BankSend: {
            const msgValue = msg.value as TxMessageValue<CosmosTxMessageTypeUrl.BankSend>;

            if (![msgValue.toAddress, msgValue.fromAddress].includes(walletAddress)) {
              break;
            }

            tokenTransactionMessage = mapSendTransaction(msgValue, walletAddress);

            break;
          }

          case CosmosTxMessageTypeUrl.IbcMsgTransfer: {
            const msgValue = msg.value as TxMessageValue<CosmosTxMessageTypeUrl.IbcMsgTransfer>;

            tokenTransactionMessage = mapIbcTransfer(msgValue);

            break;
          }

          case CosmosTxMessageTypeUrl.DistributionWithdrawDelegatorReward: {
            tokenTransactionMessage = mapWithdrawDelegatorReward(msgIndex, tx, walletAddress);

            break;
          }

          case CosmosTxMessageTypeUrl.StakingDelegate: {
            const msgValue = msg.value as TxMessageValue<CosmosTxMessageTypeUrl.StakingDelegate>;

            tokenTransactionMessage = mapDelegateTransaction(msgValue, msgIndex, tx, walletAddress);

            break;
          }

          case CosmosTxMessageTypeUrl.StakingUndelegate: {
            const msgValue = msg.value as TxMessageValue<CosmosTxMessageTypeUrl.StakingUndelegate>;

            tokenTransactionMessage = mapUndelegateTransaction(msgValue, msgIndex, tx, walletAddress);

            break;
          }

          case CosmosTxMessageTypeUrl.StakingBeginRedelegate: {
            tokenTransactionMessage = mapRedelegateTransaction(msgIndex, tx, walletAddress);

            break;
          }

          case CosmosTxMessageTypeUrl.DistributionWithdrawValidatorCommission: {
            tokenTransactionMessage = mapWithdrawValidatorRewardTransaction(msgIndex, tx, walletAddress);

            break;
          }
        }

        return [...acc, ...tokenTransactionMessage ? coerceArray(tokenTransactionMessage) : []];
      }, []);

    if (mappedMessages.length > 1) {
      return new TokenComplexTransaction(
        tx.hash,
        tx.height,
        fee,
        mappedMessages.reduce((acc, message) => acc + message.amount, 0),
        mappedMessages,
        comment,
      );
    }

    if (mappedMessages.length === 1) {
      const message = mappedMessages[0];

      return new TokenSingleTransaction(
        message.type,
        tx.hash,
        tx.height,
        fee,
        message.amount,
        message.recipient,
        message.sender,
        comment,
      );
    }

    return undefined;
  }
}
