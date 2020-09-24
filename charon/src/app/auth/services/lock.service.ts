import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, EMPTY, fromEvent, Observable, of, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, mapTo, startWith, switchMap } from 'rxjs/operators';

import { LocalStoreSection, LocalStoreService } from '../../shared/services/local-store';
import { AUTH_STORE_SECTION_KEY, StoreData } from '../models';
import { AuthService } from './auth.service';
import { LOCK_DELAY } from '../auth.tokens';

@Injectable({
  providedIn: 'root',
})
export class LockService {
  private store: LocalStoreSection<StoreData>;
  private isLocked$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isWorking$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private authService: AuthService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCK_DELAY) private lockDelay: number,
    store: LocalStoreService,
  ) {
    this.store = store.useSection(AUTH_STORE_SECTION_KEY);
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

  public unlock(): void {
    this.isLocked$.next(false);
  }

  private initLockSubscription(): void {
    this.isWorking$.pipe(
      distinctUntilChanged(),
      switchMap((isWorking) => {
        return isWorking
          ? this.getApplicationInteraction().pipe(
            startWith(of(void 0)),
            debounceTime(this.lockDelay),
            mapTo(true),
            startWith(false),
          )
          : EMPTY;
      }),
      distinctUntilChanged(),
    ).subscribe(this.isLocked$);
  }

  private getApplicationInteraction(): Observable<void> {
    return fromEvent(this.document, 'click')
      .pipe(
        mapTo(void 0),
      )
  }
}
