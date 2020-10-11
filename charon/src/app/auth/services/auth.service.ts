import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocalStoreSection, LocalStoreService } from '@shared/services/local-store';
import { uuid } from '@shared/utils/uuid';
import { CryptoService } from '@shared/services/crypto';
import { AUTH_STORE_SECTION_KEY, StoreData, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private activeUserId$: BehaviorSubject<User['id'] | undefined> = new BehaviorSubject(undefined);
  private activeUser$: BehaviorSubject<User | undefined> = new BehaviorSubject(undefined);
  private users$: BehaviorSubject<User[]> = new BehaviorSubject([]);
  private authStore: LocalStoreSection<StoreData>;

  constructor(
    store: LocalStoreService,
  ) {
    this.authStore = store.useSection(AUTH_STORE_SECTION_KEY);

    combineLatest([
      this.users$,
      this.activeUserId$,
    ]).pipe(
      map(([users, activeUserId]) => users.find(user => user.id === activeUserId)),
    ).subscribe(this.activeUser$);
  }

  public get isLoggedIn(): boolean {
    return !!this.getActiveUserInstant();
  }

  public async init(): Promise<void> {
    const users = await this.authStore.get('users') || [];
    debugger
    this.users$.next(users);

    const activeUserId = await this.authStore.get('activeUserId');
    this.activeUserId$.next(activeUserId);
  }

  public confirmCurrentUserEmail(): Promise<void> {
    const currentUser = this.getActiveUserInstant();
    const newUsers: User[] = [
      ...this.users$.value.filter(user => user.id !== currentUser.id),
      {
        ...currentUser,
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
    user: Omit<User, 'id' | 'mainEmail' | 'passwordHash'> & { password: string }
  ): Promise<User['id']> {
    const id = uuid();
    const newUsers = [
      ...this.users$.value,
      {
        id,
        birthdate: user.birthdate,
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

    console.log(newUsers);

    await this.updateUsers(newUsers);

    return id;
  }

  public async changeUser(userId: User['id']): Promise<void> {
    await this.authStore.set('activeUserId', userId);
    this.activeUserId$.next(userId);
  }

  public async removeUser(userId: User['id']): Promise<void> {
    const newUsers = this.users$.value.filter(({id}) => id !== userId);
    if (this.isLoggedIn && userId === this.getActiveUserInstant().id) {
      await this.logout();
    }
    await this.updateUsers(newUsers);
  }

  public async logout(): Promise<void> {
    await this.authStore.remove('activeUserId');
    this.activeUserId$.next(undefined);
  }

  public validateCurrentUserPassword(password: string): boolean {
    return CryptoService.encryptPassword(password) === this.getActiveUserInstant().passwordHash;
  }

  private async updateUsers(users: User[]): Promise<void> {
    debugger;
    await this.authStore.set('users', users)
    this.users$.next(users);
  }
}
