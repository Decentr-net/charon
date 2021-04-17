import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, pluck, switchMap, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TransferRole } from 'decentr-js';

import { InfiniteLoadingService } from '@shared/utils/infinite-loading';
import { AuthService } from '@core/auth';
import { BankService, NetworkService } from '@core/services';
import { Asset } from './assets-page.definitions';
import { TokenTransaction } from '../../components/token-transactions-table';

@UntilDestroy()
@Injectable()
export class AssetsPageService
  extends InfiniteLoadingService<TokenTransaction>
  implements OnDestroy
{
  private canLoadMoreAsRecipient: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private canLoadMoreAsSender: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private readonly sentList: BehaviorSubject<TokenTransaction[]>
    = new BehaviorSubject([]);

  private readonly receivedList: BehaviorSubject<TokenTransaction[]>
    = new BehaviorSubject([]);

  private loadingCount: number = 2;

  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
    private bankService: BankService,
  ) {
    super();

    this.canLoadMore.pipe(
      filter(Boolean),
      untilDestroyed(this),
    ).subscribe(() => {
      this.canLoadMoreAsSender.next(true);
      this.canLoadMoreAsRecipient.next(true);
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
          token: 'tDEC',
          transactions: this.list$,
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

  protected getNextItems(): Observable<TokenTransaction[]> {
    return combineLatest([
      this.getHistory('recipient'),
      this.getHistory('sender'),
    ]).pipe(
      map(([received, sent]) => [...received, ...sent]),
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

    if (!roleCanLoadMore.value) {
      return of([]);
    }

    const page = roleList.value.length / this.loadingCount + 1;

    return this.bankService.getTransferHistory(
      this.authService.getActiveUserInstant().wallet.address,
      role,
      {
        page,
        limit: this.loadingCount,
      },
    ).pipe(
      tap((response) => {
        if (+roleList.value.length + +response.count >= +response.totalCount) {
          roleCanLoadMore.next(false);
        }
      }),
      map((response) => response.transactions.map((transaction) => ({
        ...transaction,
        role,
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
}
