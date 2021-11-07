import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, pluck, switchMap, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  StdTxFee,
  StdTxMessage,
  StdTxMessageType,
  Transaction,
  TransactionActionType,
  TransactionLogEvent,
  TXsSearchResponse,
  Wallet,
} from 'decentr-js';

import { InfiniteLoadingService } from '@shared/utils/infinite-loading';
import { AuthService } from '@core/auth';
import { BankService, BlocksService, NetworkService } from '@core/services';
import { Asset } from './assets-page.definitions';
import { PDVService } from '@shared/services/pdv';
import { TokenTransaction, TokenTransactionType } from '../../components/token-transactions-table';

@UntilDestroy()
@Injectable()
export class AssetsPageService
  extends InfiniteLoadingService<TokenTransaction>
  implements OnDestroy {

  private canLoadMoreType: Record<TokenTransactionType, BehaviorSubject<boolean>> =
    Object.values(TokenTransactionType).reduce((acc, transactionType) => ({
      ...acc,
      [transactionType]: new BehaviorSubject(true),
    }), {}) as Record<TokenTransactionType, BehaviorSubject<boolean>>;

  private transactionList: Record<TokenTransactionType, BehaviorSubject<TokenTransaction[]>> =
    Object.values(TokenTransactionType).reduce((acc, transactionType) => ({
      ...acc,
      [transactionType]: new BehaviorSubject([]),
    }), {}) as Record<TokenTransactionType, BehaviorSubject<TokenTransaction[]>>;

  private transactionPage: Record<TokenTransactionType, number> = {} as Record<TokenTransactionType, number>;

  private pdvRewardsHistoryLoaded: boolean;

  private loadingCount = 100;

  constructor(
    private authService: AuthService,
    private blocksService: BlocksService,
    private networkService: NetworkService,
    private bankService: BankService,
    private pdvService: PDVService,
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
    return this.authService.getActiveUser().pipe(
      pluck('wallet', 'address'),
      switchMap((walletAddress) => this.bankService.getDECBalance(walletAddress)),
    );
  }

  public getTokenBalanceHistory(): Observable<TokenTransaction[]> {
    return !this.pdvRewardsHistoryLoaded ? this.pdvService.getTokenBalanceHistory().pipe(
      switchMap((balanceHistory) => balanceHistory.length ? combineLatest(
        balanceHistory.map((historyItem) => this.blocksService.getBlock(historyItem.height).pipe(
          map((block) => ({
            timestamp: new Date(block.block.header.time).valueOf(),
            type: TokenTransactionType.PdvRewards,
            amount: {
              amount: historyItem.coins[0].amount,
              denom: historyItem.coins[0].denom,
            },
          }) as TokenTransaction),
        )),
      ) : of([])),
    ) : of([]);
  }

  public getTotalTransactionCount(): Observable<number> {
    return combineLatest([
      this.pdvService.getTokenBalanceHistory(),
      this.loadHistory(TokenTransactionType.TransferReceived, 1, 1),
      this.loadHistory(TokenTransactionType.TransferSent, 1, 1),
      this.loadHistory(TokenTransactionType.WithdrawRewards, 1, 1),
      this.loadHistory(TokenTransactionType.WithdrawDelegate, 1, 1),
      this.loadHistory(TokenTransactionType.WithdrawUndelegate, 1, 1),
      this.loadHistory(TokenTransactionType.WithdrawRedelegate, 1, 1),
    ]).pipe(
      map((lists) => lists.reduce((acc, list) => acc + list.length, 0)),
    );
  }

  protected getNextItems(): Observable<TokenTransaction[]> {
    return combineLatest([
      this.getTokenBalanceHistory().pipe(
        tap(() => this.pdvRewardsHistoryLoaded = true),
      ),
      this.getHistory(TokenTransactionType.TransferReceived),
      this.getHistory(TokenTransactionType.TransferSent),
      this.getHistory(TokenTransactionType.WithdrawRewards),
      this.getHistory(TokenTransactionType.WithdrawDelegate),
      this.getHistory(TokenTransactionType.WithdrawUndelegate),
      this.getHistory(TokenTransactionType.WithdrawRedelegate),
    ]).pipe(
      map((lists) => lists.reduce((acc, list) => [...acc, ...list], [])),
    );
  }

  protected pushItems(items: TokenTransaction[]): void {
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

  private getHistory(historyType: TokenTransactionType): Observable<TokenTransaction[]> {
    const historyCanLoadMore = this.canLoadMoreType[historyType];
    const historyList = this.transactionList[historyType];
    const historyPage = this.transactionPage[historyType];

    if (!historyCanLoadMore.value) {
      return of([]);
    }

    const page$ = historyPage
      ? of(historyPage - 1)
      : this.getPagesCount(historyType);

    return page$.pipe(
      tap((page) => this.transactionPage[historyType] = page),
      mergeMap((page) => {
        if (!page) {
          historyCanLoadMore.next(false);
          return of([]);
        }

        return this.loadHistory(historyType, page);
      }),
      tap((transactions) => historyList.next([...historyList.value, ...transactions])),
    );
  }

  private getPagesCount(historyType: TokenTransactionType): Observable<number> {
    return this.searchTransactions(historyType).pipe(
      map((response) => +response.page_total),
    );
  }

  private searchTransactions(historyType: TokenTransactionType, page: number = 1, limit: number = this.loadingCount): Observable<TXsSearchResponse> {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    let role: string;

    switch (historyType) {
      case TokenTransactionType.TransferSent:
        role = 'sender';
        break;
      default:
        role = 'recipient';
        break;
    }

    let action: TransactionActionType | string;

    switch (historyType) {
      case TokenTransactionType.WithdrawRewards:
        action = 'withdraw_delegator_reward';
        break;
      case TokenTransactionType.WithdrawDelegate:
        action = 'delegate';
        break;
      case TokenTransactionType.WithdrawUndelegate:
        action = 'begin_unbonding';
        break;
      case TokenTransactionType.WithdrawRedelegate:
        action = 'begin_redelegate';
        break;
      default:
        action = 'send';
        break;
    }

    return this.bankService.searchTransactions(
      {
        messageAction: action,
        transferRecipient: role === 'recipient' ? walletAddress : undefined,
        transferSender: role === 'sender' ? walletAddress : undefined,
        page,
        limit,
      }
    );
  }

  private mapSendTransaction(
    msg: StdTxMessage<StdTxMessageType.CosmosSend>,
    tx: Transaction<StdTxMessageType.CosmosSend>,
    walletAddress: Wallet['address'],
  ): TokenTransaction {
    const txValue = tx.tx.value;

    return {
      amount: msg.value.amount[0],
      comment: txValue.memo,
      fee: txValue.fee,
      hash: tx.txhash,
      recipient: msg.value.to_address,
      sender: msg.value.from_address,
      type: msg.value.to_address === walletAddress ? TokenTransactionType.TransferReceived : TokenTransactionType.TransferSent,
      timestamp: new Date(tx.timestamp).valueOf(),
    };
  }

  private mapWithdrawTransaction(
    msg: StdTxMessage<StdTxMessageType.CosmosWithdrawDelegationReward | StdTxMessageType.CosmosDelegate | StdTxMessageType.CosmosUndelegate>,
    tx: Transaction,
    logEvents: TransactionLogEvent[],
    fee: StdTxFee,
    type: TokenTransactionType,
  ): TokenTransaction {
    const txValue = tx.tx.value;

    const amountString = logEvents
      .find((event) => event.type === 'transfer')?.attributes
      .find((attribute) => attribute.key === 'amount')?.value || '0udec';

    const amount = {
      amount: parseFloat(amountString).toString(),
      denom: amountString.replace(/[^0-9]/g, ''),
    };

    return {
      amount,
      fee,
      type,
      comment: txValue.memo,
      hash: tx.txhash,
      recipient: msg.value.delegator_address,
      sender: msg.value.validator_address,
      timestamp: new Date(tx.timestamp).valueOf(),
    };
  }

  private mapWithdrawRedelegationTransaction(
    msg: StdTxMessage<StdTxMessageType.CosmosBeginRedelegate>,
    tx: Transaction<StdTxMessageType.CosmosBeginRedelegate>,
    logEvents: TransactionLogEvent[],
    fee: StdTxFee,
  ): TokenTransaction[] {
    const txValue = tx.tx.value;

    const transfers = logEvents
      .find((event) => event.type === 'transfer')?.attributes
      .reduce((acc, attribute, index, attributes) => {
        const nextAttribute = attributes[index + 1];

        if (attribute.key === 'sender' && nextAttribute?.key === 'amount') {
          const amount = {
            amount: parseFloat(nextAttribute.value).toString(),
            denom: nextAttribute.value.replace(/[^0-9]/g, ''),
          };

          return [...acc, { sender: attribute.value, amount }];
        }

        return acc;
      }, []);

    return transfers.map((transfer, index) => ({
      amount: transfer.amount,
      fee: index === 0 ? fee : undefined,
      comment: txValue.memo,
      hash: tx.txhash,
      recipient: msg.value.delegator_address,
      sender: transfer.sender,
      type: TokenTransactionType.WithdrawRedelegate,
      timestamp: new Date(tx.timestamp).valueOf(),
    }));
  }

  private mapTransaction(tx: Transaction): TokenTransaction[] {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;
    const txValue = tx.tx.value;

    return txValue.msg
      .reduce((acc, msg, index) => {
        const logEvents = tx.logs?.find((log) => +log.msg_index === index)?.events;

        if (!logEvents) {
          return acc;
        }

        switch (msg.type) {
          case StdTxMessageType.CosmosSend: {
            const sendMessage = msg as StdTxMessage<StdTxMessageType.CosmosSend>;
            return [sendMessage.value.to_address, sendMessage.value.from_address].includes(walletAddress)
              ? [...acc, this.mapSendTransaction(sendMessage, tx as Transaction<StdTxMessageType.CosmosSend>, walletAddress)]
              : acc;
          }
          case StdTxMessageType.CosmosWithdrawDelegationReward: {
            const withdrawMessage = msg as StdTxMessage<StdTxMessageType.CosmosWithdrawDelegationReward>;
            const tokenTransaction = this.mapWithdrawTransaction(withdrawMessage, tx, logEvents, !index ? txValue.fee : undefined, TokenTransactionType.WithdrawRewards);

            return [...acc, tokenTransaction];
          }
          case StdTxMessageType.CosmosDelegate: {
            const withdrawMessage = msg as StdTxMessage<StdTxMessageType.CosmosWithdrawDelegationReward>;
            const tokenTransaction = this.mapWithdrawTransaction(withdrawMessage, tx, logEvents, !index ? txValue.fee : undefined, TokenTransactionType.WithdrawDelegate);

            return [...acc, tokenTransaction];
          }
          case StdTxMessageType.CosmosUndelegate: {
            const withdrawMessage = msg as StdTxMessage<StdTxMessageType.CosmosWithdrawDelegationReward>;
            const tokenTransaction = this.mapWithdrawTransaction(withdrawMessage, tx, logEvents, !index ? txValue.fee : undefined, TokenTransactionType.WithdrawUndelegate);

            return [...acc, tokenTransaction];
          }
          case StdTxMessageType.CosmosBeginRedelegate: {
            const withdrawMessage = msg as StdTxMessage<StdTxMessageType.CosmosBeginRedelegate>;
            const tokenTransactions = this.mapWithdrawRedelegationTransaction(withdrawMessage, tx as Transaction<StdTxMessageType.CosmosBeginRedelegate>, logEvents, !index ? txValue.fee : undefined);

            return [...acc, ...tokenTransactions];
          }
          default:
            return acc;
        }
      }, []);
  }

  private loadHistory(historyType: TokenTransactionType, page: number = 1, limit: number = this.loadingCount): Observable<TokenTransaction[]> {
    return this.searchTransactions(historyType, page, limit).pipe(
      map(({ txs }) => txs.reduce((acc, tx) => {
        const tokenTransactions: TokenTransaction[] = this.mapTransaction(tx);

        return [...acc, ...tokenTransactions];
      }, [])),
    );
  }
}
