import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { LocalStoreSection, LocalStoreService } from '@shared/services/local-store';
import { uuid } from '@shared/utils/uuid';
import { CryptoService } from '@shared/services/crypto';
import { AUTH_STORE_SECTION_KEY, StoreData, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private activeUser$: BehaviorSubject<User | undefined> = new BehaviorSubject(undefined);
  private users$: BehaviorSubject<User[]> = new BehaviorSubject([]);
  private authStore: LocalStoreSection<StoreData>;

  constructor(
    store: LocalStoreService,
  ) {
    this.authStore = store.useSection(AUTH_STORE_SECTION_KEY);
  }

  public get isLoggedIn(): boolean {
    return !!this.activeUser$.value;
  }

  public async init(): Promise<void> {
    const users = await this.authStore.get('users') || [];
    this.users$.next(users);

    const activeUserId = await this.authStore.get('activeUserId');
    const activeUser = users.find(user => user.id === activeUserId);
    this.activeUser$.next(activeUser);
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

    await this.updateUsers(newUsers);

    return id;
  }

  public async changeUser(userId: User['id']): Promise<void> {
    await this.authStore.set('activeUserId', userId);
    const activeUser = this.users$.value.find(user => user.id === userId);
    this.activeUser$.next(activeUser);
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
    this.activeUser$.next(undefined);
  }

  public validateCurrentUserPassword(password: string): boolean {
    return CryptoService.encryptPassword(password) === this.getActiveUserInstant().passwordHash;
  }

  private async updateUsers(users: User[]): Promise<void> {
    await this.authStore.set('users', users)
    this.users$.next(users);
  }
}
