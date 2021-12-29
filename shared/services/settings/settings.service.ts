import { Wallet } from 'decentr-js';

import { BrowserLocalStorage } from '../browser-storage';
import { SettingsStorage } from './settings.definitions';
import { UserSettingsService } from './user-settings.service';

export class SettingsService {
  private readonly settingsStorage
    = BrowserLocalStorage.getInstance().useSection<SettingsStorage>('settings');

  public getUserSettingsService(walletAddress: Wallet['address']): UserSettingsService {
    return new UserSettingsService(this.settingsStorage.useSection(walletAddress));
  }
}
