import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { LocalStoreSection, LocalStoreService } from '@shared/services/local-store';
import { uuid } from '@shared/utils/uuid';
import { CryptoService } from '@shared/services/crypto';
import { StoreData, User } from '../models';

@UntilDestroy()
@Injectable()
export class AuthService {
  private activeUserId$: Observable<User['id'] | undefined>;
  private activeUser$: BehaviorSubject<User | undefined> = new BehaviorSubject(undefined);
  private users$: BehaviorSubject<User[]> = new BehaviorSubject([]);
  private authStore: LocalStoreSection<StoreData>;

  constructor(
    store: LocalStoreService,
  ) {
    this.authStore = store.useSection('auth');
  }

  public get isLoggedIn(): boolean {
    return !!this.getActiveUserInstant();
  }

  public async init(): Promise<void> {
    from(this.authStore.get('users')).pipe(
      mergeMap((users) => this.authStore.onChange('users').pipe(
        startWith(users),
      )),
      map(users => users || []),
      untilDestroyed(this),
    ).subscribe(this.users$);

    this.activeUserId$ = from(this.authStore.get('activeUserId')).pipe(
      mergeMap((activeUserId) => this.authStore.onChange('activeUserId').pipe(
        startWith(activeUserId),
      )),
    );

    combineLatest([
      this.users$,
      this.activeUserId$,
    ]).pipe(
      map(([users, activeUserId]) => users.find(user => user.id === activeUserId)),
      untilDestroyed(this),
    ).subscribe(this.activeUser$);
  }

  public confirmUserEmail(userId: User['id']): Promise<void> {
    const user = this.users$.value.find(user => user.id === userId);

    const newUsers: User[] = [
      ...this.users$.value.filter(user => user.id !== userId),
      {
        ...user,
        emailConfirmed: true,
      },
    ];

    return this.updateUsers(newUsers);
  }

  public getActiveUser(): Observable<User | undefined> {
    return this.activeUser$.asObservable();
  }

  public getActiveUserInstant(): User | undefined {
    return this.activeUser$.value;
  }

  public async createUser(
    user: Omit<User, 'id' | 'mainEmail' | 'passwordHash'> & { password: string },
  ): Promise<User['id']> {
    const id = uuid();
    const newUsers = [
      ...this.users$.value,
      {
        id,
        birthday: user.birthday,
        emailConfirmed: user.emailConfirmed,
        emails: user.emails,
        gender: user.gender,
        mainEmail: user.emails[0],
        passwordHash: CryptoService.encryptPassword(user.password),
        privateKey: user.privateKey,
        publicKey: user.publicKey,
        usernames: user.usernames,
        walletAddress: user.walletAddress,
      },
    ];

    await this.updateUsers(newUsers);

    return id;
  }

  public changeUser(userId: User['id']): Promise<void> {
    return this.authStore.set('activeUserId', userId);
  }

  public async removeUser(userId: User['id']): Promise<void> {
    const newUsers = this.users$.value.filter(({id}) => id !== userId);
    if (this.isLoggedIn && userId === this.getActiveUserInstant().id) {
      await this.logout();
    }
    await this.updateUsers(newUsers);
  }

  public logout(): Promise<void> {
    return this.authStore.remove('activeUserId');
  }

  public validateCurrentUserPassword(password: string): boolean {
    return CryptoService.encryptPassword(password) === this.getActiveUserInstant().passwordHash;
  }

  private updateUsers(users: User[]): Promise<void> {
    return this.authStore.set('users', users)
  }
}
