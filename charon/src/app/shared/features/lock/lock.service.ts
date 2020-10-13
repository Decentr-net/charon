import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStoreSection, LocalStoreService } from '@shared/services/local-store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LOCK_DELAY, LOCK_INTERACTION_SOURCE } from './lock.tokens';
import { filter, switchMap } from 'rxjs/operators';

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
    @Inject(LOCK_DELAY) private lockDelay: number,
    @Inject(LOCK_INTERACTION_SOURCE) private lockInteractionSource: Observable<void>,
  ) {
    this.store = localStoreService.useSection(LOCK_STORE_SECTION_KEY);
  }

  public async init(): Promise<void> {
    await this.updateInitialState();
  }

  public start(): void {
    this.isWorking$.next(true);
  }

  public stop(): void {
    this.isWorking$.next(false);
  }

  public unlock(): void {
    this.isLocked$.next(false);
  }

  private async updateInitialState(): Promise<void> {
    const lastInteraction = await this.store.get('lastInteractionTime');
    const isLocked = lastInteraction && (+new Date() - lastInteraction > this.lockDelay);
    this.isLocked$.next(isLocked);
  }

  private createLockSubscription(): void {
  }

  private createInteractionSubscription(): void {
    this.lockInteractionSource.pipe(
      filter(() => this.isWorking$.value),
      switchMap(() => this.store.set('lastInteractionTime', Date.now())),
      untilDestroyed(this),
    ).subscribe()
  }
}
