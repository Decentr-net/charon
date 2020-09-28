import { Inject, Injectable, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, EMPTY, fromEvent, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mapTo, startWith, switchMap, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { LocalStoreSection, LocalStoreService } from '../../shared/services/local-store';
import { AUTH_STORE_SECTION_KEY, StoreData } from '../models';
import { LOCK_DELAY, LOCKED_REDIRECT_URL } from '../auth.tokens';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class LockService {
  private store: LocalStoreSection<StoreData>;
  private isLocked$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isWorking$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private ngZone: NgZone,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCK_DELAY) private lockDelay: number,
    @Inject(LOCKED_REDIRECT_URL) private lockedRedirectUrl: string,
    store: LocalStoreService,
  ) {
    this.store = store.useSection(AUTH_STORE_SECTION_KEY);
    this.initLastInteractionUpdateSubscription()
    this.initLockSubscription();
  }

  public get isLocked(): boolean {
    return this.isLocked$.value;
  }

  public async init(): Promise<void> {
    const lastInteraction = await this.store.get('lastInteraction');
    const isLocked = lastInteraction && (+new Date() - lastInteraction > this.lockDelay);
    this.isLocked$.next(isLocked);
  }

  public start(): void {
    this.isWorking$.next(true);
  }

  public stop(): void {
    this.isWorking$.next(false);
  }

  private initLockSubscription(): void {
    this.isWorking$.pipe(
      distinctUntilChanged(),
      map((isWorking) => {
        return isWorking
          ? this.getLastInteractionFromStorage().pipe(
            startWith(Date.now()),
            debounceTime(this.lockDelay),
            mapTo(true),
          )
          : EMPTY;
      }),
      switchMap((obs) => obs.pipe(
        startWith(false)
      )),
      distinctUntilChanged(),
      tap((isLocked) => this.isLocked$.next(isLocked)),
      filter((isLocked) => isLocked),
      untilDestroyed(this),
    ).subscribe(() => {
      this.ngZone.run(() => {
        this.router.navigate([this.lockedRedirectUrl]);
      });
    });
  }

  private initLastInteractionUpdateSubscription(): void {
    this.isWorking$.pipe(
      filter(isWorking => isWorking),
      switchMap(() => fromEvent(this.document, 'click')),
      switchMap(() => this.store.set('lastInteraction', Date.now())),
      untilDestroyed(this),
    ).subscribe()
  }

  private getLastInteractionFromStorage(): Observable<StoreData['lastInteraction']> {
    return this.store.onChange('lastInteraction');
  }
}
