import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LocalStoreSection, LocalStoreService } from '@shared/services/local-store';

interface SignUpStore {
  lastEmailSendingTime: number;
}

@Injectable()
export class SignUpStoreService {
  private store: LocalStoreSection<SignUpStore>;

  constructor(localStoreService: LocalStoreService) {
    this.store = localStoreService.useSection('signUp');
  }

  public setLastEmailSendingTime(time: number = Date.now()): Promise<void> {
    return this.store.set('lastEmailSendingTime', time);
  }

  public getLastEmailSendingTime(): Promise<number | undefined> {
    return this.store.get('lastEmailSendingTime');
  }

  public onLastEmailSendingTimeChange(): Observable<number> {
    return this.store.onChange('lastEmailSendingTime');
  }

  public clear(): Promise<void> {
    return this.store.clear();
  }
}
