import { Inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  mapTo,
  mergeMap,
  mergeMapTo,
  switchMap,
  switchMapTo,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { LockBrowserStorageService } from '@shared/services/lock';
import { LOCK_DELAY, LOCK_ACTIVITY_SOURCE, LOCK_REDIRECT_URL } from '../lock.tokens';

@UntilDestroy()
@Injectable()
export class LockService {
  private isLocked$: ReplaySubject<boolean> = new ReplaySubject(1);

  private isWorking$: ReplaySubject<boolean> = new ReplaySubject(1);

  private returnUrl: string;

  constructor(
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

  public unlocked$(): Observable<void> {
    return this.isLocked$.pipe(
      tap((val) => console.log('unlocked$', val)),
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

  public lock(): Promise<void> {
    return this.lockStorage.setLocked(true);
  }

  public async unlock(): Promise<void> {
    await this.updateLastActivityTime();
    await this.lockStorage.setLocked(false);
  }

  public navigateToLockedUrl(): Promise<boolean> {
    this.returnUrl = this.router.url;

    console.log('navigating to locked url');

    return this.navigate(this.lockRedirectUrl);
  }

  public navigateToReturnUrl(): Promise<boolean> {
    const returnUrl = this.returnUrl;
    this.returnUrl = '';

    console.log(returnUrl);

    return this.navigate(returnUrl || '/');
  }

  private init(): void {
    this.initActivityUpdateSubscription();

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

    this.locked$.pipe(
      tap(() => console.log('navigate from locked event')),
      switchMap(() => this.navigateToLockedUrl()),
      untilDestroyed(this),
    ).subscribe();

    this.unlocked$().pipe(
      switchMap(() => this.navigateToReturnUrl()),
      untilDestroyed(this),
    ).subscribe();
  }

  private listenStorageLockState(): Observable<boolean> {
    return combineLatest([
      this.lockStorage.getLockedChanges(),
      this.lockStorage.getLastActivityTimeChanges(),
    ]).pipe(
      map(([isLocked, lastActivityTime]) => {
        return isLocked || lastActivityTime && ((Date.now() - lastActivityTime) > this.lockDelay)
      }),
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

  private navigate(url: string): Promise<boolean> {
    return this.ngZone.run(() => this.router.navigate([url]));
  }

  private whenWorking<T>(observable: Observable<T>): Observable<T> {
    return this.started$.pipe(
      mergeMapTo(observable.pipe(
        takeUntil(this.stopped$),
      )),
    );
  }
}
