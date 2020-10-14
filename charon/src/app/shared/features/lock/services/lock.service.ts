import { Inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, filter, mapTo, startWith, switchMapTo, takeUntil } from 'rxjs/operators';

import { LocalStoreSection, LocalStoreService } from '@shared/services/local-store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LOCK_DELAY, LOCK_INTERACTION_SOURCE, LOCK_REDIRECT_URL } from '../lock.tokens';

const LOCK_STORE_SECTION_KEY = 'lock';

interface LockStore {
  lastInteractionTime: number;
}

@UntilDestroy()
@Injectable()
export class LockService {
  private isLocked$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isWorking$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private readonly store: LocalStoreSection<LockStore>;

  constructor(
    localStoreService: LocalStoreService,
    private ngZone: NgZone,
    private router: Router,
    @Inject(LOCK_DELAY) private lockDelay: number,
    @Inject(LOCK_INTERACTION_SOURCE) private lockInteractionSource: Observable<void>,
    @Inject(LOCK_REDIRECT_URL) private lockRedirectUrl: string,
  ) {
    this.store = localStoreService.useSection(LOCK_STORE_SECTION_KEY);
  }

  public async init(): Promise<void> {
    await this.updateInitialState();
    this.initInteractionSubscription();
    this.initLockSubscription();
  }

  public get isLocked(): boolean {
    return this.isLocked$.value;
  }

  public get stopped$(): Observable<boolean> {
    return this.isWorking$.pipe(
      filter(isWorking => !isWorking),
    );
  }

  public get started$(): Observable<boolean> {
    return this.isWorking$.pipe(
      filter(isWorking => isWorking),
    );
  }

  public start(): void {
    this.isWorking$.next(true);
  }

  public stop(): void {
    this.isWorking$.next(false);
  }

  public lock(): void {
    this.isLocked$.next(true);
  }

  public unlock(): void {
    this.isLocked$.next(false);
  }

  private async updateInitialState(): Promise<void> {
    const lastInteraction = await this.store.get('lastInteractionTime');
    const isLocked = !lastInteraction || (+new Date() - lastInteraction > this.lockDelay);
    this.isLocked$.next(isLocked);
  }

  private initLockSubscription(): void {
    this.started$.pipe(
      switchMapTo(this.getLastInteractionTimeSource().pipe(
        startWith({}),
        takeUntil(this.stopped$),
      )),
      debounceTime(this.lockDelay),
      mapTo(true),
      untilDestroyed(this),
    ).subscribe(this.isLocked$);

    this.isLocked$.pipe(
      filter(isLocked => isLocked),
      untilDestroyed(this),
    ).subscribe(() => this.navigateToLockedUrl());
  }

  private initInteractionSubscription(): void {
    this.started$.pipe(
      switchMapTo(this.lockInteractionSource.pipe(
        startWith({}),
        takeUntil(this.stopped$),
      )),
      untilDestroyed(this),
    ).subscribe(() => this.updateLastInteractionTime());

    this.stopped$.pipe(
      untilDestroyed(this),
    ).subscribe(() => this.clearStore());
  }

  private getLastInteractionTimeSource(): Observable<number> {
    return this.store.onChange('lastInteractionTime');
  }

  private updateLastInteractionTime(): Promise<void> {
    return this.store.set('lastInteractionTime', Date.now())
  }

  private clearStore(): Promise<void> {
    return this.store.clear();
  }

  private navigateToLockedUrl(): void {
    this.ngZone.run(() => {
      this.router.navigate([this.lockRedirectUrl]);
    });
  }
}
