import { Inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, filter, mapTo, startWith, switchMapTo, takeUntil } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { BrowserLocalStorage, BrowserStorage } from '@shared/services/browser-storage';
import { LOCK_DELAY, LOCK_INTERACTION_SOURCE, LOCK_REDIRECT_URL } from '../lock.tokens';

const LOCK_STORE_SECTION_KEY = 'lock';

interface LockStore {
  lastInteractionTime: number;
  locked: boolean;
}

@UntilDestroy()
@Injectable()
export class LockService {
  private isLocked$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private isWorking$: ReplaySubject<boolean> = new ReplaySubject(1);

  private readonly store: BrowserStorage<LockStore>;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    @Inject(LOCK_DELAY) private lockDelay: number,
    @Inject(LOCK_INTERACTION_SOURCE) private lockInteractionSource: Observable<void>,
    @Inject(LOCK_REDIRECT_URL) private lockRedirectUrl: string,
  ) {
    this.store = BrowserLocalStorage.getInstance().useSection(LOCK_STORE_SECTION_KEY);

    this.initInteractionSubscription();
    this.initLockSubscription();
  }

  public async init(): Promise<void> {
    const lastInteraction = await this.store.get('lastInteractionTime');
    const wasLockedLastTime = await this.store.get('locked');
    const isLocked = wasLockedLastTime || !lastInteraction || (+new Date() - lastInteraction > this.lockDelay);
    this.isLocked$.next(isLocked);
  }

  public get isLocked(): boolean {
    return this.isLocked$.value;
  }

  public get stopped$(): Observable<void> {
    return this.isWorking$.pipe(
      filter(isWorking => !isWorking),
      mapTo(void 0),
    );
  }

  public get started$(): Observable<void> {
    return this.isWorking$.pipe(
      filter(isWorking => isWorking),
      mapTo(void 0),
    );
  }

  public start(): void {
    this.isWorking$.next(true);
  }

  public stop(): void {
    this.isWorking$.next(false);
  }

  public async lock(): Promise<boolean> {
    console.log('lock');
    this.isLocked$.next(true);
    await this.store.set('locked', true);
    return this.navigateToLockedUrl();
  }

  public unlock(): Promise<void> {
    this.isLocked$.next(false);
    return this.store.set('locked', false);
  }

  private initLockSubscription(): void {
    this.started$.pipe(
      switchMapTo(this.getLastInteractionTimeSource().pipe(
        startWith({}),
        takeUntil(this.stopped$),
      )),
      debounceTime(this.lockDelay),
      untilDestroyed(this),
    ).subscribe(() => this.lock());
  }

  private initInteractionSubscription(): void {
    this.started$.pipe(
      switchMapTo(this.lockInteractionSource.pipe(
        startWith({}),
        takeUntil(this.stopped$),
      )),
      untilDestroyed(this),
    ).subscribe(() => {
      console.log('interacted');
      this.updateLastInteractionTime();
    });
  }

  private getLastInteractionTimeSource(): Observable<number> {
    return this.store.onChange('lastInteractionTime');
  }

  private updateLastInteractionTime(): Promise<void> {
    return this.store.set('lastInteractionTime', Date.now());
  }

  private navigateToLockedUrl(): Promise<boolean> {
    return this.ngZone.run(() => {
      return this.router.navigate([this.lockRedirectUrl]);
    });
  }
}
