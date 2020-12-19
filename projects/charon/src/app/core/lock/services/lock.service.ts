import { Inject, Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  mapTo,
  mergeMap,
  mergeMapTo,
  switchMap,
  switchMapTo,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { LockBrowserStorageService } from '@shared/services/lock';
import { LOCK_DELAY, LOCK_ACTIVITY_SOURCE, LOCK_REDIRECT_URL } from '../lock.tokens';

export const LOCK_RETURN_URL_PARAM = 'returnUrl';

@UntilDestroy()
@Injectable()
export class LockService {
  private isLocked$: ReplaySubject<boolean> = new ReplaySubject(1);

  private isWorking$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private activatedRoute: ActivatedRoute,
    private lockStorage: LockBrowserStorageService,
    private ngZone: NgZone,
    private router: Router,
    @Inject(LOCK_DELAY) private lockDelay: number,
    @Inject(LOCK_ACTIVITY_SOURCE) private lockActivitySource: Observable<void>,
    @Inject(LOCK_REDIRECT_URL) private lockRedirectUrl: string,
  ) {
    this.init();
  }

  public get lockedState$(): Observable<boolean> {
    return this.isLocked$.asObservable();
  }

  public get locked$(): Observable<void> {
    return this.isLocked$.pipe(
      distinctUntilChanged(),
      filter(Boolean),
      mapTo(void 0),
    );
  }

  public get unlocked$(): Observable<void> {
    return this.isLocked$.pipe(
      distinctUntilChanged(),
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

  public async lock(): Promise<void> {
    return this.lockStorage.setLocked(true);
  }

  public async unlock(): Promise<void> {
    return this.lockStorage.setLocked(false);
  }

  public navigateToLockedUrl(): Promise<boolean> {
    return this.navigate(this.lockRedirectUrl, {
      queryParams: {
        [LOCK_RETURN_URL_PARAM]: this.router.url,
      }
    });
  }

  public navigateToUnlockedUrl(): Promise<boolean> {
    const returnUrl = this.activatedRoute.snapshot.queryParamMap.get(LOCK_RETURN_URL_PARAM);

    return this.navigate(returnUrl || '/');
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

    this.unlocked$.pipe(
      tap(() => console.log('unlocked before navigate')),
      switchMapTo(this.locked$.pipe(
        tap(() => console.log('locked before navigate')),
        take(1),
      )),
      untilDestroyed(this),
    ).subscribe(() => {
      this.navigateToLockedUrl();
    });

    this.listenStorageLockState().pipe(
      distinctUntilChanged(),
      untilDestroyed(this),
    ).subscribe((isLocked) => {
      console.log('storage lock', isLocked);
      this.isLocked$.next(isLocked);
    });

    this.started$.pipe(
      switchMapTo(this.listenActivityEnd().pipe(
        takeUntil(this.stopped$),
      )),
      tap(() => console.log('activity end lock')),
      switchMap(() => this.lock()),
      untilDestroyed(this),
    ).subscribe();
  }

  private listenStorageLockState(): Observable<boolean> {
    return forkJoin([
      this.lockStorage.getLocked(),
      this.lockStorage.getLastActivityTime(),
    ]).pipe(
      mergeMap(([isLocked, lastActivityTime]) => {
        return !isLocked && lastActivityTime && ((Date.now() - lastActivityTime) > this.lockDelay)
          ? this.lock()
          : of(void 0);
      }),
      mergeMapTo(this.lockStorage.getLockedChanges()),
    );
  }

  private listenActivityEnd(): Observable<void> {
    return this.lockStorage.getLastActivityTimeChanges().pipe(
      debounceTime(this.lockDelay),
      mapTo(void 0),
    );
  }

  private initActivityUpdateSubscription(): void {
    this.started$.pipe(
      switchMapTo(this.lockActivitySource.pipe(
        takeUntil(this.stopped$),
        finalize(() => console.log('activity update stopped')),
      )),
      tap(() => console.log('activity updated', new Date().toTimeString())),
      mergeMap(() => this.updateLastActivityTime()),
      untilDestroyed(this),
    ).subscribe();
  }

  private updateLastActivityTime(): Promise<void> {
    return this.lockStorage.setLastActivityTime(Date.now());
  }

  private navigate(url: string, extras?: NavigationExtras): Promise<boolean> {
    return this.ngZone.run(() => this.router.navigate([url], extras));
  }

  private whenWorking<T>(observable: Observable<T>): Observable<T> {
    return this.started$.pipe(
      mergeMapTo(observable.pipe(
        takeUntil(this.stopped$),
      )),
    );
  }
}
