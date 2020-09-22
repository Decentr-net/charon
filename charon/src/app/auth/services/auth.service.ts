import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { LocalStoreService } from '../../shared/services/local-store';
import { uuid } from '../../shared/utils/uuid';
import { StoreData, User } from '../models';

const AUTH_STORE_SECTION_KEY = 'auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private activeUser$: BehaviorSubject<User | undefined> = new BehaviorSubject(undefined);
  private users$: BehaviorSubject<User[]> = new BehaviorSubject([]);

  constructor(
    private store: LocalStoreService,
  ) {
  }

  public get isLoggedIn(): boolean {
    return !!this.activeUser$.value;
  }

  public async init(): Promise<void> {
    const storeSection = await this.store.get<StoreData>(AUTH_STORE_SECTION_KEY);

    const users = storeSection && storeSection.users || [];
    this.users$.next(users);

    const activeUserId = storeSection && storeSection.activeUserId;
    const activeUser = users.find(user => user.id === activeUserId);
    this.activeUser$.next(activeUser);
  }

  public getActiveUser(): Observable<User | undefined> {
    return this.activeUser$.asObservable();
  }

  public async createUser(user: Omit<User, 'id'>): Promise<User['id']> {
    const id = uuid();
    const newUsers = [
      ...this.users$.value,
      {
        ...user,
        id,
      },
    ];

    await this.store.set<StoreData>(AUTH_STORE_SECTION_KEY, {
      users: newUsers,
      activeUserId: this.activeUser$.value && this.activeUser$.value.id,
    });
    this.users$.next(newUsers);

    return id;
  }

  public async changeUser(userId: User['id']): Promise<void> {
    await this.store.set<StoreData>(AUTH_STORE_SECTION_KEY, {
      users: this.users$.value,
      activeUserId: userId,
    });
    const newActiveUser = this.users$.value.find(user => user.id === userId);
    this.activeUser$.next(newActiveUser)
  }
}
