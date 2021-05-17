import { Inject, Injectable, NgZone, Optional } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, UrlTree } from '@angular/router';
import { fromEvent, merge, Observable, ReplaySubject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  mapTo,
  mergeMap,
  mergeMapTo,
  switchMapTo,
  take,
  takeUntil,
  throttleTime,
} from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { isOpenedInTab } from '@shared/utils/browser';
import { LockBrowserStorageService } from '@shared/services/lock';
import { ONE_SECOND } from '@shared/utils/date';
import { AppRoute } from '../../../app-route';
import { LOCK_ACTIVITY_SOURCE, LOCK_REDIRECT_URL } from '../lock.tokens';

export const LOCK_RETURN_URL_PARAM = 'returnUrl';

@UntilDestroy()
@Injectable()
export class LockService {
  private isLocked$: ReplaySubject<boolean> = new ReplaySubject(1);

  private isWorking$: ReplaySubject<boolean> = new ReplaySubject(1);

  private activitySource: Observable<unknown>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private lockStorage: LockBrowserStorageService,
    private ngZone: NgZone,
    private router: Router,
    @Inject(LOCK_REDIRECT_URL) private lockRedirectUrl: string,
    @Optional() @Inject(LOCK_ACTIVITY_SOURCE) lockActivitySource: Observable<void>,
  ) {
    this.activitySource = lockActivitySource
      || merge(
        fromEvent(document, 'click', { capture: true }),
        fromEvent(document, 'keypress'),
        fromEvent(document, 'mouseover'),
      ).pipe(
        throttleTime(ONE_SECOND),
      );

    this.init();
  }

  public get lockedState$(): Observable<boolean> {
    return this.isLocked$.asObservable();
  }

  public get locked$(): Observable<void> {
    return this.isLocked$.pipe(
      filter(Boolean),
      mapTo(void 0),
    );
  }

  public get unlocked$(): Observable<void> {
    return this.isLocked$.pipe(
      filter((isLocked) => !isLocked),
      mapTo(void 0),
    );
  }

  private get started$(): Observable<void> {
    return this.isWorking$.pipe(
      distinctUntilChanged(),
      filter(Boolean),
      mapTo(void 0),
    );
  }

  private get stopped$(): Observable<void> {
    return this.isWorking$.pipe(
      distinctUntilChanged(),
      filter((isWorking) => !isWorking),
      mapTo(void 0),
    );
  }

  public start(): void {
    this.isWorking$.next(true);
  }

  public stop(): void {
    this.isWorking$.next(false);
  }

  public lock(): Promise<void> {
    return this.lockStorage.setLocked(true);
  }

  public unlock(): Promise<void> {
    return this.lockStorage.setLocked(false);
  }

  public navigateToLockedUrl(): Promise<boolean> {
    if (this.isOnLockedPage()) {
      return Promise.resolve(true);
    }

    return this.navigate(this.lockRedirectUrl, {
      queryParams: {
        [LOCK_RETURN_URL_PARAM]: this.router.url,
      }
    });
  }

  public navigateToUnlockedUrl(): Promise<boolean> {
    const returnUrl = this.activatedRoute.snapshot.queryParamMap.get(LOCK_RETURN_URL_PARAM);

    return this.navigate(isOpenedInTab() ? this.router.parseUrl(returnUrl || '/') : AppRoute.Portal);
  }

  private init(): void {
    this.initActivityUpdateSubscription();

    this.locked$.pipe(
      switchMapTo(this.unlocked$.pipe(
        take(1),
      )),
      untilDestroyed(this),
    ).subscribe(() => {
      this.navigateToUnlockedUrl();
    });

    this.whenWorking(this.unlocked$.pipe(
      switchMapTo(this.locked$.pipe(
        take(1),
      ))),
    ).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.navigateToLockedUrl();
    });

    this.listenStorageLockState().pipe(
      distinctUntilChanged(),
      untilDestroyed(this),
    ).subscribe((isLocked) => {
      this.isLocked$.next(isLocked);
    });
  }

  private listenStorageLockState(): Observable<boolean> {
    return this.lockStorage.getLockedChanges();
  }

  private initActivityUpdateSubscription(): void {
    this.whenWorking(this.activitySource).pipe(
      mergeMap(() => this.updateLastActivityTime()),
      untilDestroyed(this),
    ).subscribe();
  }

  private updateLastActivityTime(): Promise<void> {
    return this.lockStorage.setLastActivityTime(Date.now());
  }

  private navigate(url: string | UrlTree, extras?: NavigationExtras): Promise<boolean> {
    return this.ngZone.run(() => {
      return url instanceof UrlTree
        ? this.router.navigateByUrl(url, extras)
        : this.router.navigate([url], extras);
    });
  }

  private isOnLockedPage(): boolean {
    return this.router.url.startsWith(this.lockRedirectUrl);
  }

  private whenWorking<T>(observable: Observable<T>): Observable<T> {
    return this.started$.pipe(
      mergeMapTo(observable.pipe(
        takeUntil(this.stopped$),
      )),
    );
  }
}
