import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { InfiniteLoadingService } from '@shared/utils/infinite-loading';
import { AuthService } from '@core/auth';
import { BankService, BlocksService, NetworkService } from '@core/services';
import { Asset } from './assets-page.definitions';
import { TokenTransactionMessage, TokenTransactionMessageType } from '../../components/token-transactions-table';

@UntilDestroy()
@Injectable()
export class AssetsPageService
  extends InfiniteLoadingService<TokenTransactionMessage>
  implements OnDestroy {

  private canLoadMoreType: Record<TokenTransactionMessageType, BehaviorSubject<boolean>> =
    Object.values(TokenTransactionMessageType).reduce((acc, transactionType) => ({
      ...acc,
      [transactionType]: new BehaviorSubject(true),
    }), {}) as Record<TokenTransactionMessageType, BehaviorSubject<boolean>>;

  private transactionList: Record<TokenTransactionMessageType, BehaviorSubject<TokenTransactionMessage[]>> =
    Object.values(TokenTransactionMessageType).reduce((acc, transactionType) => ({
      ...acc,
      [transactionType]: new BehaviorSubject([]),
    }), {}) as Record<TokenTransactionMessageType, BehaviorSubject<TokenTransactionMessage[]>>;

  private transactionPage: Record<TokenTransactionMessageType, number> = {} as Record<TokenTransactionMessageType, number>;

  private pdvRewardsHistoryLoaded: boolean;

  private loadingCount = 100;

  constructor(
    private authService: AuthService,
    private blocksService: BlocksService,
    private networkService: NetworkService,
    private bankService: BankService,
  ) {
    super();

    this.canLoadMore.pipe(
      filter(Boolean),
      untilDestroyed(this),
    ).subscribe(() => {
      Object.values(this.canLoadMoreType).forEach((canLoadMoreType) => canLoadMoreType.next(true));
      Object.keys(this.transactionPage).forEach((type) => this.transactionPage[type] = undefined);

      this.pdvRewardsHistoryLoaded = false;
    });
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  public get canLoadMore$(): Observable<boolean> {
    return combineLatest(Object.values(this.canLoadMoreType)).pipe(
      map((canLoadMoreValues) => canLoadMoreValues.some(Boolean)),
    );
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

  public getBalance(): Observable<string> {
    return this.bankService.getDECBalance();
  }

  // TODO
  public getTokenBalanceHistory(): Observable<TokenTransactionMessage[]> {
    return of([]);
    // return !this.pdvRewardsHistoryLoaded ? this.pdvService.getTokenBalanceHistory().pipe(
    //   switchMap((balanceHistory) => balanceHistory.length ? combineLatest(
    //     balanceHistory.map((historyItem) => this.blocksService.getBlock(historyItem.height).pipe(
    //       map((block) => ({
    //         timestamp: new Date(block.block.header.time).valueOf(),
    //         type: TokenTransactionMessageType.PdvRewards,
    //         amount: {
    //           amount: historyItem.coins[0].amount,
    //           denom: historyItem.coins[0].denom,
    //         },
    //       }) as TokenTransactionMessage),
    //     )),
    //   ) : of([])),
    // ) : of([]);
  }

  public getTotalTransactionCount(): Observable<number> {
    return of(0);
    // return combineLatest([
    //   this.pdvService.getTokenBalanceHistory(),
    //   this.loadHistory(TokenTransactionMessageType.TransferReceived, 1, 1),
    //   this.loadHistory(TokenTransactionMessageType.TransferSent, 1, 1),
    //   this.loadHistory(TokenTransactionMessageType.WithdrawRewards, 1, 1),
    //   this.loadHistory(TokenTransactionMessageType.WithdrawDelegate, 1, 1),
    //   this.loadHistory(TokenTransactionMessageType.WithdrawUndelegate, 1, 1),
    //   this.loadHistory(TokenTransactionMessageType.WithdrawRedelegate, 1, 1),
    // ]).pipe(
    //   map((lists) => lists.reduce((acc, list) => acc + list.length, 0)),
    // );
  }

  protected getNextItems(): Observable<TokenTransactionMessage[]> {
    return of([]);
    // return combineLatest([
    //   this.getTokenBalanceHistory().pipe(
    //     tap(() => this.pdvRewardsHistoryLoaded = true),
    //   ),
    //   this.getHistory(TokenTransactionMessageType.TransferReceived),
    //   this.getHistory(TokenTransactionMessageType.TransferSent),
    //   this.getHistory(TokenTransactionMessageType.WithdrawRewards),
    //   this.getHistory(TokenTransactionMessageType.WithdrawDelegate),
    //   this.getHistory(TokenTransactionMessageType.WithdrawUndelegate),
    //   this.getHistory(TokenTransactionMessageType.WithdrawRedelegate),
    // ]).pipe(
    //   map((lists) => lists.reduce((acc, list) => [...acc, ...list], [])),
    // );
  }

  protected pushItems(items: TokenTransactionMessage[]): void {
    const newValue = [...this.list.value, ...items]
      .sort((left, right) => {
        return new Date(right.timestamp).valueOf() - new Date(left.timestamp).valueOf();
      });

    this.list.next(newValue);
  }

  protected clear(): void {
    super.clear();

    Object.values(this.transactionList).forEach((list) => list.next([]));
  }

  // private getHistory(historyType: TokenTransactionMessageType): Observable<TokenTransactionMessage[]> {
  //   const historyCanLoadMore = this.canLoadMoreType[historyType];
  //   const historyList = this.transactionList[historyType];
  //   const historyPage = this.transactionPage[historyType];
  //
  //   if (!historyCanLoadMore.value) {
  //     return of([]);
  //   }
  //
  //   const page$ = historyPage
  //     ? of(historyPage - 1)
  //     : this.getPagesCount(historyType);
  //
  //   return page$.pipe(
  //     tap((page) => this.transactionPage[historyType] = page),
  //     mergeMap((page) => {
  //       if (!page) {
  //         historyCanLoadMore.next(false);
  //         return of([]);
  //       }
  //
  //       return this.loadHistory(historyType, page);
  //     }),
  //     tap((transactions) => historyList.next([...historyList.value, ...transactions])),
  //   );
  // }

  private getPagesCount(historyType: TokenTransactionMessageType): Observable<number> {
    return of(0);
    // return this.searchTransactions(historyType).pipe(
    //   map((response) => +response.page_total),
    // );
  }

  // private searchTransactions(historyType: TokenTransactionMessageType, page: number = 1, limit: number = this.loadingCount): Observable<TXsSearchResponse> {
  //   const walletAddress = this.authService.getActiveUserInstant().wallet.address;
  //
  //   let role: string;
  //
  //   switch (historyType) {
  //     case TokenTransactionMessageType.TransferSent:
  //       role = 'sender';
  //       break;
  //     default:
  //       role = 'recipient';
  //       break;
  //   }
  //
  //   let action: TransactionActionType | string;
  //
  //   switch (historyType) {
  //     case TokenTransactionMessageType.WithdrawRewards:
  //       action = 'withdraw_delegator_reward';
  //       break;
  //     case TokenTransactionMessageType.WithdrawDelegate:
  //       action = 'delegate';
  //       break;
  //     case TokenTransactionMessageType.WithdrawUndelegate:
  //       action = 'begin_unbonding';
  //       break;
  //     case TokenTransactionMessageType.WithdrawRedelegate:
  //       action = 'begin_redelegate';
  //       break;
  //     default:
  //       action = 'send';
  //       break;
  //   }
  //
  //   return this.bankService.searchTransactions(
  //     {
  //       messageAction: action,
  //       transferRecipient: role === 'recipient' ? walletAddress : undefined,
  //       transferSender: role === 'sender' ? walletAddress : undefined,
  //       page,
  //       limit,
  //     }
  //   );
  // }

  // private mapSendTransaction(
  //   msg: any,
  //   tx: any,
  //   // msg: StdTxMessage<StdTxMessageType.CosmosSend>,
  //   // tx: Transaction<StdTxMessageType.CosmosSend>,
  //   walletAddress: Wallet['address'],
  // ): TokenTransactionMessage {
  //   const txValue = tx.tx.value;
  //   const txType = msg.value.to_address === walletAddress ? TokenTransactionMessageType.TransferReceived : TokenTransactionMessageType.TransferSent;
  //
  //   const txAmount = msg.value.amount[0];
  //   return {
  //     amount: {
  //       ...txAmount,
  //       amount: (+txAmount.amount * (txType === TokenTransactionMessageType.TransferReceived ? 1 : -1)).toString(),
  //     },
  //     comment: txValue.memo,
  //     fee: txValue.fee,
  //     hash: tx.txhash,
  //     recipient: msg.value.to_address,
  //     sender: msg.value.from_address,
  //     timestamp: new Date(tx.timestamp).valueOf(),
  //     type: txType,
  //   };
  // }

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

  // private mapTransaction(tx: Transaction): TokenTransactionMessage[] {
  //   const walletAddress = this.authService.getActiveUserInstant().wallet.address;
  //   const txValue = tx.tx.value;
  //
  //   return txValue.msg
  //     .reduce((acc, msg, index) => {
  //       const logEvents = tx.logs?.find((log) => +log.msg_index === index)?.events;
  //
  //       if (!logEvents) {
  //         return acc;
  //       }
  //
  //       switch (msg.type) {
  //         case StdTxMessageType.CosmosSend: {
  //           const sendMessage = msg as StdTxMessage<StdTxMessageType.CosmosSend>;
  //           return [sendMessage.value.to_address, sendMessage.value.from_address].includes(walletAddress)
  //             ? [...acc, this.mapSendTransaction(sendMessage, tx as any, walletAddress)]
  //             : acc;
  //         }
  //         case StdTxMessageType.CosmosWithdrawDelegationReward: {
  //           const withdrawMessage = msg as StdTxMessage<StdTxMessageType.CosmosWithdrawDelegationReward>;
  //           const tokenTransaction = this.mapWithdrawTransaction(withdrawMessage, tx, logEvents, !index ? txValue.fee : undefined, TokenTransactionMessageType.WithdrawRewards);
  //
  //           return [...acc, ...tokenTransaction ? [tokenTransaction] : []];
  //         }
  //         case StdTxMessageType.CosmosDelegate: {
  //           const withdrawMessage = msg as StdTxMessage<StdTxMessageType.CosmosWithdrawDelegationReward>;
  //           const tokenTransaction = this.mapWithdrawTransaction(withdrawMessage, tx, logEvents, !index ? txValue.fee : undefined, TokenTransactionMessageType.WithdrawDelegate);
  //
  //           return [...acc, ...tokenTransaction ? [tokenTransaction] : []];
  //         }
  //         case StdTxMessageType.CosmosUndelegate: {
  //           const withdrawMessage = msg as StdTxMessage<StdTxMessageType.CosmosWithdrawDelegationReward>;
  //           const tokenTransaction = this.mapWithdrawTransaction(withdrawMessage, tx, logEvents, !index ? txValue.fee : undefined, TokenTransactionMessageType.WithdrawUndelegate);
  //
  //           return [...acc, ...tokenTransaction ? [tokenTransaction] : []];
  //         }
  //         case StdTxMessageType.CosmosBeginRedelegate: {
  //           const withdrawMessage = msg as StdTxMessage<StdTxMessageType.CosmosBeginRedelegate>;
  //           const tokenTransactions = this.mapWithdrawRedelegationTransaction(withdrawMessage, tx as any, logEvents, !index ? txValue.fee : undefined);
  //
  //           return [...acc, ...tokenTransactions];
  //         }
  //         case StdTxMessageType.CosmosWithdrawValidatorCommission: {
  //           const withdrawMessage = msg as StdTxMessage<StdTxMessageType.CosmosWithdrawValidatorCommission>;
  //           const tokenTransaction = this.mapWithdrawValidatorTransaction(withdrawMessage, tx as any, logEvents, !index ? txValue.fee : undefined);
  //
  //           return [...acc, ...tokenTransaction ? [tokenTransaction] : []];
  //         }
  //         default:
  //           return acc;
  //       }
  //     }, []);
  // }

  // private loadHistory(historyType: TokenTransactionMessageType, page: number = 1, limit: number = this.loadingCount): Observable<TokenTransactionMessage[]> {
  //   return this.searchTransactions(historyType, page, limit).pipe(
  //     map(({ txs }) => txs.reduce((acc, tx) => {
  //       const tokenTransactions: TokenTransactionMessage[] = this.mapTransaction(tx);
  //
  //       return [...acc, ...tokenTransactions];
  //     }, [])),
  //   );
  // }
}
