import { Inject, Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, merge, Observable, ReplaySubject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  mapTo,
  startWith,
  switchMapTo,
  takeUntil,
} from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { BrowserLocalStorage, BrowserStorage } from '@shared/services/browser-storage';
import { LOCK_DELAY, LOCK_INTERACTION_SOURCE, LOCK_REDIRECT_URL } from '../lock.tokens';

const LOCK_STORE_SECTION_KEY = 'lock';

export const LOCK_RETURN_URL_PARAM_NAME = 'returnUrl';

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
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private router: Router,
    @Inject(LOCK_DELAY) private lockDelay: number,
    @Inject(LOCK_INTERACTION_SOURCE) private lockInteractionSource: Observable<void>,
    @Inject(LOCK_REDIRECT_URL) private lockRedirectUrl: string,
  ) {
    this.store = BrowserLocalStorage.getInstance().useSection(LOCK_STORE_SECTION_KEY);
  }

  public async init(): Promise<void> {
    await this.initInitialState();
    this.initInteractionSubscription();
    this.initLockSubscription();
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

  private get childActivatedRoute(): ActivatedRoute {
    let child = this.activatedRoute;

    while (child.firstChild) {
      child = child.firstChild;
    }

    return child;
  }

  public start(): void {
    this.isWorking$.next(true);
  }

  public stop(): void {
    this.isWorking$.next(false);
  }

  public async lock(options?: { avoidStore: boolean }): Promise<boolean> {
    if (this.isLocked) {
      return;
    }

    this.isLocked$.next(true);
    if (!options?.avoidStore) {
      await this.store.set('locked', true);
    }
    return this.navigateToLockedUrl();
  }

  public async unlock(options?: { avoidStore: boolean }): Promise<void> {
    if (!this.isLocked) {
      return;
    }

    this.isLocked$.next(false);

    if (!options?.avoidStore) {
      await this.store.set('locked', false);
    }

    this.ngZone.run(() => {
      this.router.navigate([
        this.childActivatedRoute.snapshot.queryParamMap.get(LOCK_RETURN_URL_PARAM_NAME) || '/',
      ]);
    });
  }

  public navigateToLockedUrl(): Promise<boolean> {
    return this.ngZone.run(() => {
      return this.router.navigate([this.lockRedirectUrl], {
        queryParams: {
          [LOCK_RETURN_URL_PARAM_NAME]: this.router.routerState.snapshot.url,
        },
        queryParamsHandling: '',
      });
    });
  }

  private initLockSubscription(): void {
    merge(
      this.getStoreLockedChange().pipe(
        filter((isLocked) => isLocked),
      ),
      this.started$.pipe(
        switchMapTo(this.getStoreLastInteractionTimeChange().pipe(
          startWith({}),
          takeUntil(this.stopped$),
        )),
        debounceTime(this.lockDelay),
      ),
    ).pipe(
      debounceTime(100),
      untilDestroyed(this),
    ).subscribe(() => this.lock());

    this.getStoreLockedChange().pipe(
      filter((isLocked) => !isLocked),
      untilDestroyed(this),
    ).subscribe(() => {
      this.unlock({ avoidStore: true });
    });
  }

  private initInteractionSubscription(): void {
    this.started$.pipe(
      switchMapTo(this.lockInteractionSource.pipe(
        startWith({}),
        takeUntil(this.stopped$),
      )),
      untilDestroyed(this),
    ).subscribe(() => {
      this.updateLastInteractionTime();
    });
  }

  private async initInitialState(): Promise<void> {
    const lastInteraction = await this.store.get('lastInteractionTime');
    const wasLockedLastTime = await this.store.get('locked');
    const isLocked = wasLockedLastTime || !lastInteraction || (+new Date() - lastInteraction > this.lockDelay);
    this.isLocked$.next(isLocked);
  }

  private getStoreLastInteractionTimeChange(): Observable<number> {
    return this.store.onChange('lastInteractionTime').pipe(
      distinctUntilChanged(),
    );
  }

  private getStoreLockedChange(): Observable<boolean> {
    return this.store.onChange('locked').pipe(
      distinctUntilChanged(),
    );
  }

  private updateLastInteractionTime(): Promise<void> {
    return this.store.set('lastInteractionTime', Date.now());
  }
}
