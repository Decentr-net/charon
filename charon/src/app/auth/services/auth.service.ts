import { Inject, Injectable } from '@angular/core';

import { AuthStore, AuthStoreData } from '../models';
import { STORE_SECTION } from '../auth.tokens';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedIn: boolean = true;

  constructor(
    private store: AuthStore,
    @Inject(STORE_SECTION) private storeSectionKey: string,
  ) {
  }

  public async init(): Promise<void> {
    const storeSection = await this.store.get<AuthStoreData>(this.storeSectionKey);
    this.isLoggedIn = !!storeSection && !!storeSection.user;
  }

  public async signIn(user: any): Promise<void> {
    await this.store.set(this.storeSectionKey, {
      user,
    });
    this.isLoggedIn = true;
  }
}
