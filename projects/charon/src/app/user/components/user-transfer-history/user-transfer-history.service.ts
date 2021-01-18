import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TransferRole } from 'decentr-js';

import { InfiniteLoadingService } from '@shared/utils/infinite-loading';
import { AuthService } from '@core/auth';
import { BankService, StateChangesService } from '@core/services';
import { AssetHistoryItem } from '../assets-history-list-item';

@UntilDestroy()
@Injectable()
export class UserTransferHistoryService
  extends InfiniteLoadingService<AssetHistoryItem>
  implements OnDestroy
{
  private canLoadMoreAsRecipient: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private canLoadMoreAsSender: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private readonly sentList: BehaviorSubject<AssetHistoryItem[]>
    = new BehaviorSubject([]);

  private readonly receivedList: BehaviorSubject<AssetHistoryItem[]>
    = new BehaviorSubject([]);

  private loadingCount: number = 100;

  constructor(
    private authService: AuthService,
    private bankService: BankService,
    private stateChangesService: StateChangesService,
  ) {
    super();

    this.stateChangesService.getWalletAndNetworkApiChanges().pipe(
      untilDestroyed(this),
    ).subscribe(() => this.reload());

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

  protected getNextItems(): Observable<AssetHistoryItem[]> {
    return combineLatest([
      this.getHistory('recipient'),
      this.getHistory('sender'),
    ]).pipe(
      map(([received, sent]) => [...received, ...sent]),
    );
  }

  protected pushItems(items: AssetHistoryItem[]): void {
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

  private getHistory(role: TransferRole): Observable<AssetHistoryItem[]> {
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

  private getRoleList(role: TransferRole): BehaviorSubject<AssetHistoryItem[]> {
    switch (role) {
      case 'recipient':
        return this.receivedList;
      case 'sender':
        return this.sentList;
    }
  }
}
