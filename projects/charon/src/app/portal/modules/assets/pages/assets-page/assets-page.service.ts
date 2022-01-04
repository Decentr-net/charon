import { Injectable, OnDestroy } from '@angular/core';
import { combineLatest, Observable, of, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, tap } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DecentrTxClient, DecodedIndexedTx, TxMessageTypeUrl, TxMessageValue } from 'decentr-js';

import { InfiniteLoadingService } from '@shared/utils/infinite-loading';
import { AuthService } from '@core/auth';
import { BankService, BlocksService, NetworkService } from '@core/services';
import { Asset } from './assets-page.definitions';
import { TokenTransactionMessage } from '../../components/token-transactions-table';
import { mapSendTransaction } from './mapping';

@UntilDestroy()
@Injectable()
export class AssetsPageService
  extends InfiniteLoadingService<TokenTransactionMessage>
  implements OnDestroy {

  private txClient: ReplaySubject<DecentrTxClient> = new ReplaySubject(1);

  constructor(
    private authService: AuthService,
    private blocksService: BlocksService,
    private networkService: NetworkService,
    private bankService: BankService,
  ) {
    super();

    this.createClient()
      .then((client) => this.txClient.next(client));

    this.searchTransactions().subscribe(console.log);

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
    const wallet = this.authService.getActiveUserInstant().wallet;

    return this.getHistory();
  }

  private getHistory(): Observable<TokenTransactionMessage[]> {
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
      this.txClient.pipe(
        mergeMap((client) => client.search({ sentFromOrTo: walletAddress })),
      ),
      this.txClient.pipe(
        mergeMap((client) => client.search({ tags: [
            {
              key: 'message.action',
              value: 'delegate',
            },
            {
              key: 'message.action',
              value: 'withdraw_delegator_reward',
            },
            {
              key: 'message.action',
              value: 'begin_unbonding',
            },
            {
              key: 'message.action',
              value: 'begin_redelegate',
            },
        ]}))),
    ]).pipe(
      map((txArrays) => txArrays.reduce((acc, txs) => [...acc, ...txs], [])),
    );
  }

  // private mapWithdrawTransaction(
  //   msg: any,
  //   // msg: StdTxMessage<StdTxMessageType.CosmosWithdrawDelegationReward | StdTxMessageType.CosmosDelegate | StdTxMessageType.CosmosUndelegate>,
  //   tx: Transaction,
  //   logEvents: TransactionLogEvent[],
  //   // fee: StdTxFee,
  //   fee: any,
  //   type: TokenTransactionMessageType,
  // ): TokenTransactionMessage {
  //   const txValue = tx.tx.value;
  //
  //   const amountString = logEvents
  //     .find((event) => event.type === 'transfer')?.attributes
  //     .find((attribute) => attribute.key === 'amount')?.value;
  //
  //   if (!amountString) {
  //     return undefined;
  //   }
  //
  //   const amount = {
  //     amount: parseFloat(amountString).toString(),
  //     denom: amountString.replace(/[^0-9]/g, ''),
  //   };
  //
  //   return {
  //     amount,
  //     fee,
  //     type,
  //     comment: txValue.memo,
  //     hash: tx.txhash,
  //     recipient: msg.value.delegator_address,
  //     sender: msg.value.validator_address,
  //     timestamp: new Date(tx.timestamp).valueOf(),
  //   };
  // }

  // private mapWithdrawValidatorTransaction(
  //   msg: StdTxMessage<StdTxMessageType.CosmosWithdrawValidatorCommission>,
  //   tx: Transaction,
  //   logEvents: TransactionLogEvent[],
  //   fee: StdTxFee,
  // ): TokenTransactionMessage {
  //   const txValue = tx.tx.value;
  //
  //   const amountString = logEvents
  //     .find((event) => event.type === 'transfer')?.attributes
  //     .find((attribute) => attribute.key === 'amount')?.value;
  //
  //   if (!amountString) {
  //     return undefined;
  //   }
  //
  //   const amount = {
  //     amount: parseFloat(amountString).toString(),
  //     denom: amountString.replace(/[^0-9]/g, ''),
  //   };
  //
  //   return {
  //     amount,
  //     fee,
  //     comment: txValue.memo,
  //     hash: tx.txhash,
  //     recipient: msg.value.validator_address,
  //     sender: msg.value.validator_address,
  //     timestamp: new Date(tx.timestamp).valueOf(),
  //     type: TokenTransactionMessageType.WithdrawValidatorRewards,
  //   };
  // }

  // private mapWithdrawRedelegationTransaction(
  //   msg: StdTxMessage<StdTxMessageType.CosmosBeginRedelegate>,
  //   tx: any,
  //   logEvents: TransactionLogEvent[],
  //   fee: StdTxFee,
  // ): TokenTransactionMessage[] {
  //   const txValue = tx.tx.value;
  //
  //   const transfers = logEvents
  //     .find((event) => event.type === 'transfer')?.attributes
  //     .reduce((acc, attribute, index, attributes) => {
  //       const nextAttribute = attributes[index + 1];
  //
  //       if (attribute.key === 'sender' && nextAttribute?.key === 'amount') {
  //         const amount = {
  //           amount: parseFloat(nextAttribute.value).toString(),
  //           denom: nextAttribute.value.replace(/[^0-9]/g, ''),
  //         };
  //
  //         return [...acc, { sender: attribute.value, amount }];
  //       }
  //
  //       return acc;
  //     }, []);
  //
  //   return transfers.map((transfer, index) => ({
  //     amount: transfer.amount,
  //     fee: index === 0 ? fee : undefined,
  //     comment: txValue.memo,
  //     hash: tx.txhash,
  //     recipient: msg.value.delegator_address,
  //     sender: transfer.sender,
  //     timestamp: new Date(tx.timestamp).valueOf(),
  //     type: TokenTransactionMessageType.WithdrawRedelegate,
  //   }));
  // }

  private mapTransaction(tx: DecodedIndexedTx): TokenTransactionMessage[] {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    return tx.tx.body.messages
      .reduce((acc, msg, index) => {
        switch (msg.typeUrl) {
          case TxMessageTypeUrl.BankSend: {
            const msgValue = msg.value as TxMessageValue<TxMessageTypeUrl.BankSend>;

            return [msgValue.toAddress, msgValue.fromAddress].includes(walletAddress)
              ? [...acc, mapSendTransaction(msgValue, tx, msg.typeUrl, walletAddress)]
              : acc;
          }
          // case TxMessageTypeUrl.DistributionWithdrawDelegatorReward: {
          //   const msgValue = msg.value as TxMessageValue<TxMessageTypeUrl.DistributionWithdrawDelegatorReward>;
          //   const tokenTransaction = mapWithdrawTransaction()
          //
          //
          //   return [...acc, ...tokenTransaction ? [tokenTransaction] : []];
          // }
          // case StdTxMessageType.CosmosDelegate: {
          //   const withdrawMessage = msg as StdTxMessage<StdTxMessageType.CosmosWithdrawDelegationReward>;
          //   const tokenTransaction = this.mapWithdrawTransaction(withdrawMessage, tx, logEvents, !index ? txValue.fee : undefined, TokenTransactionMessageType.WithdrawDelegate);
          //
          //   return [...acc, ...tokenTransaction ? [tokenTransaction] : []];
          // }
          // case StdTxMessageType.CosmosUndelegate: {
          //   const withdrawMessage = msg as StdTxMessage<StdTxMessageType.CosmosWithdrawDelegationReward>;
          //   const tokenTransaction = this.mapWithdrawTransaction(withdrawMessage, tx, logEvents, !index ? txValue.fee : undefined, TokenTransactionMessageType.WithdrawUndelegate);
          //
          //   return [...acc, ...tokenTransaction ? [tokenTransaction] : []];
          // }
          // case StdTxMessageType.CosmosBeginRedelegate: {
          //   const withdrawMessage = msg as StdTxMessage<StdTxMessageType.CosmosBeginRedelegate>;
          //   const tokenTransactions = this.mapWithdrawRedelegationTransaction(withdrawMessage, tx as any, logEvents, !index ? txValue.fee : undefined);
          //
          //   return [...acc, ...tokenTransactions];
          // }
          // case StdTxMessageType.CosmosWithdrawValidatorCommission: {
          //   const withdrawMessage = msg as StdTxMessage<StdTxMessageType.CosmosWithdrawValidatorCommission>;
          //   const tokenTransaction = this.mapWithdrawValidatorTransaction(withdrawMessage, tx as any, logEvents, !index ? txValue.fee : undefined);
          //
          //   return [...acc, ...tokenTransaction ? [tokenTransaction] : []];
          // }
          // default:
          //   return acc;
        }
      }, []);
  }

  private createClient(): Promise<DecentrTxClient> {
    const nodeUrl = this.networkService.getActiveNetworkAPIInstant();

    return DecentrTxClient.create(nodeUrl);
  }
}
