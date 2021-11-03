import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, pluck, switchMap, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TransferHistory, TransferRole } from 'decentr-js';

import { InfiniteLoadingService } from '@shared/utils/infinite-loading';
import { AuthService } from '@core/auth';
import { BankService, BlocksService, NetworkService } from '@core/services';
import { Asset } from './assets-page.definitions';
import { PDVService } from '@shared/services/pdv';
import { TokenTransaction } from '../../components/token-transactions-table';

@UntilDestroy()
@Injectable()
export class AssetsPageService
  extends InfiniteLoadingService<TokenTransaction>
  implements OnDestroy {

  private canLoadMoreAsRecipient: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private canLoadMoreAsSender: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private readonly sentList: BehaviorSubject<TokenTransaction[]>
    = new BehaviorSubject([]);

  private readonly receivedList: BehaviorSubject<TokenTransaction[]>
    = new BehaviorSubject([]);

  private sentPage: number;
  private receivedPage: number;
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
      this.canLoadMoreAsSender.next(true);
      this.sentPage = undefined;
      this.canLoadMoreAsRecipient.next(true);
      this.receivedPage = undefined;
      this.pdvRewardsHistoryLoaded = false;
    });
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  public get canLoadMore$(): Observable<boolean> {
    return combineLatest([
      this.canLoadMoreAsRecipient,
      this.canLoadMoreAsSender,
    ]).pipe(
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
            role: 'pdv-rewards',
            amount: {
              amount: historyItem.coins[0].amount,
              denom: historyItem.coins[0].denom,
            },
          })),
        )),
      ) : of([])),
    ) : of([]);
  }

  public getTotalTransactionCount(): Observable<number> {
    return combineLatest([
      this.getTokenBalanceHistory(),
      this.loadHistory('recipient', 1, 1),
      this.loadHistory('sender', 1, 1),
    ]).pipe(
      map(([
             rewardsHistory,
             received,
             sent,
           ]) => rewardsHistory.length + received.totalCount + sent.totalCount),
    );
  }

  protected getNextItems(): Observable<TokenTransaction[]> {
    return combineLatest([
      this.getTokenBalanceHistory().pipe(
        tap(() => this.pdvRewardsHistoryLoaded = true),
      ),
      this.getHistory('recipient'),
      this.getHistory('sender'),
    ]).pipe(
      map(([
             rewardsHistory,
             received,
             sent,
           ]) => [
        ...rewardsHistory,
        ...received,
        ...sent,
      ]),
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

    this.receivedList.next([]);
    this.sentList.next([]);
  }

  private getHistory(role: TransferRole): Observable<TokenTransaction[]> {
    const roleCanLoadMore = this.getRoleCanLoadMore(role);
    const roleList = this.getRoleList(role);
    const rolePage = this.getRolePage(role);

    if (!roleCanLoadMore.value) {
      return of([]);
    }

    const page$ = rolePage
      ? of(rolePage - 1)
      : this.getPagesCount(role);

    return page$.pipe(
      tap((page) => this.setRolePage(role, page)),
      mergeMap((page) => {
        if (!page) {
          roleCanLoadMore.next(false);
          return of({ transactions: [] });
        }

        return this.loadHistory(role, page);
      }),
      map((response) => response.transactions.map((transaction) => ({
        ...transaction,
        role,
        timestamp: new Date(transaction.timestamp).valueOf(),
      }))),
      tap((transactions) => roleList.next([...roleList.value, ...transactions])),
    );
  }

  private getRoleCanLoadMore(role: TransferRole): BehaviorSubject<boolean> {
    switch (role) {
      case 'recipient':
        return this.canLoadMoreAsRecipient;
      case 'sender':
        return this.canLoadMoreAsSender;
    }
  }

  private getRoleList(role: TransferRole): BehaviorSubject<TokenTransaction[]> {
    switch (role) {
      case 'recipient':
        return this.receivedList;
      case 'sender':
        return this.sentList;
    }
  }

  private getRolePage(role: TransferRole): number {
    switch (role) {
      case 'recipient':
        return this.receivedPage;
      case 'sender':
        return this.sentPage;
    }
  }

  private setRolePage(role: TransferRole, page: number): void {
    switch (role) {
      case 'recipient':
        this.receivedPage = page;
        break;
      case 'sender':
        this.sentPage = page;
        break;
    }
  }

  private getPagesCount(role: TransferRole): Observable<number> {
    return this.loadHistory(role).pipe(
      map((response) => response.pageTotal),
    );
  }

  private loadHistory(role: TransferRole, page: number = 1, limit: number = this.loadingCount): Observable<TransferHistory> {
    return this.bankService.getTransferHistory(
      this.authService.getActiveUserInstant().wallet.address,
      role,
      {
        page,
        limit,
      }
    );
  }
}
