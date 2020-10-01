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

  public getActiveUser(): Observable<User | undefined> {
    return this.activeUser$.asObservable();
  }

  public getActiveUserInstant(): User | undefined {
    return this.activeUser$.value;
  }

  public async createUser(user: Omit<User, 'id' | 'passwordHash'> & { password: string }): Promise<User['id']> {
    const id = uuid();
    const newUsers = [
      ...this.users$.value,
      {
        ...user,
        id,
        passwordHash: CryptoService.encryptPassword(user.password)
      },
    ];

    await this.authStore.set('users', newUsers)
    this.users$.next(newUsers);

    return id;
  }

  public async changeUser(userId: User['id']): Promise<void> {
    await this.authStore.set('activeUserId', userId);
    const activeUser = this.users$.value.find(user => user.id === userId);
    this.activeUser$.next(activeUser);
  }

  public async removeUser(userId: User['id']): Promise<void> {
    const newUsers = this.users$.value.filter(({id}) => id !== userId);
    this.users$.next(newUsers);
  }

  public validateCurrentUserPassword(password: string): boolean {
    return CryptoService.encryptPassword(password) === this.getActiveUserInstant().passwordHash;
  }
}
