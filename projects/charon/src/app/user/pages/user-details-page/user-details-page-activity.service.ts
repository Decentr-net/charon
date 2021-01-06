import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize, map, shareReplay, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PDVListPaginationOptions } from 'decentr-js';

import { coerceTimestamp } from '../../../../../../../shared/utils/date';
import { PDVService, StateChangesService } from '../../../core/services';
import { PDVActivityListItem } from '../../components';

@UntilDestroy()
@Injectable()
export class UserDetailsPageActivityService {
  private readonly activityList: BehaviorSubject<PDVActivityListItem[]> = new BehaviorSubject([]);
  private readonly canLoadMore: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private readonly loadMore: Subject<void> = new Subject();
  private readonly loadingCount: number = 20;
  private readonly stopLoading$: Subject<void> = new Subject<void>();

  constructor(
    private pdvService: PDVService,
    private stateChangesService: StateChangesService
  ) {
    this.stateChangesService.getWalletAndNetworkApiChanges().pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.reload();
    });

    this.loadMore.pipe(
      tap(() => this.isLoading.next(true)),
      switchMap(() => this.stateChangesService.getWalletAndNetworkApiChanges().pipe(
        take(1),
      )),
      switchMap(({ networkApi, wallet }) => this.getPDVActivityList(
        networkApi,
        wallet.address, {
        limit: this.loadingCount,
        from: this.getLastPDVUnixTimestamp(),
      }).pipe(
        tap((items) => (items.length < this.loadingCount) && this.canLoadMore.next(false)),
        takeUntil(this.stopLoading$),
        finalize(() => this.isLoading.next(false)),
      )),
      untilDestroyed(this),
    ).subscribe((items) => this.activityList.next([
      ...this.activityList.value,
      ...items,
    ]));
  }

  public get activityList$(): Observable<PDVActivityListItem[]> {
    return this.activityList.asObservable();
  }

  public get canLoadMore$(): Observable<boolean> {
    return this.canLoadMore;
  }

  public get isLoading$(): Observable<boolean> {
    return this.isLoading.pipe(
      shareReplay(1),
    );
  }

  public loadMoreActivity(): void {
    this.loadMore.next();
  }

  private getPDVActivityList(
    networkApi: string,
    walletAddress: string,
    paginationOptions: PDVListPaginationOptions
  ): Observable<PDVActivityListItem[]> {
    return this.pdvService.getPDVList(networkApi, walletAddress, paginationOptions).pipe(
      map((list) => list.map(({ address, timestamp, type }) => ({
        address,
        date: new Date(coerceTimestamp(timestamp)),
        type: Number(type)
      })),
    ));
  }

  private getLastPDVUnixTimestamp(): number | undefined {
    return this.activityList.value[this.activityList.value.length - 1]?.date.valueOf() / 1000 || undefined;
  }

  private clear(): void {
    this.stopLoading$.next();
    this.activityList.next([]);
    this.canLoadMore.next(true);
  }

  private reload(): void {
    this.clear();
    this.loadMoreActivity();
  }
}
