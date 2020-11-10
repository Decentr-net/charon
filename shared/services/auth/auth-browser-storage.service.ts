import { combineLatest, from, Observable } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';

import { BrowserLocalStorage } from '../browser-storage';
import { User } from './user';

interface AuthBrowserStorageData<T extends User> {
  readonly activeUserId: T['id'];
  readonly users: T[];
}

export class AuthBrowserStorageService<T extends User = User> {
  private readonly browserStorage
    = BrowserLocalStorage.getInstance().useSection<AuthBrowserStorageData<T>>('auth');

  public getUsers(): Observable<T[]> {
    return from(this.browserStorage.get('users')).pipe(
      mergeMap((users) => this.browserStorage.onChange('users').pipe(
        startWith(users as T[]),
      )),
      map(users => users || []),
    );
  }

  public async removeUser(id: T['id']): Promise<void> {
    const users = await this.browserStorage.get('users') || [];
    const newUsers = users.filter((user) => user.id !== id);
    await this.browserStorage.set('users', newUsers);
  }

  public setActiveUserId(id: T['id']): Promise<void> {
    return this.browserStorage.set('activeUserId', id);
  }

  public removeActiveUserId(): Promise<void> {
    return this.browserStorage.remove('activeUserId');
  }

  public getActiveUser(): Observable<T> {
    return combineLatest([
      this.getUsers(),
      this.getActiveUserId(),
    ]).pipe(
      map(([users, activeUserId]) => users.find(user => user.id === activeUserId)),
    );
  }

  public async createUser(user: T): Promise<void> {
    const users = await this.browserStorage.get('users') || [];
    const newUsers = [...users, user];
    await this.browserStorage.set('users', newUsers);
  }

  public async updateUser(id: T['id'], update: Partial<Omit<T, 'id'>>): Promise<void> {
    const users = await this.browserStorage.get('users');

    const userToUpdate = users.find((user) => user.id === id);

    const otherUsers = users.filter(user => user.id !== id);

    await this.browserStorage.set('users', [
      ...otherUsers,
      {
        ...userToUpdate,
        ...update,
      },
    ]);
  }

  private getActiveUserId(): Observable<T['id']> {
    return from(this.browserStorage.get('activeUserId')).pipe(
      mergeMap((activeUserId) => this.browserStorage.onChange('activeUserId').pipe(
        startWith(activeUserId as T['id']),
      )),
    );
  }
}
