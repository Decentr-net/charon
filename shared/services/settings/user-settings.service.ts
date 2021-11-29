import { BrowserStorage } from '../browser-storage';
import { PDVSettingsService } from './pdv';
import { UserSettingsStorage } from './settings.definitions';
import { LockSettingsService } from './lock';

export class UserSettingsService {
  private lockSettingsService: LockSettingsService;

  private pdvSettingsService: PDVSettingsService;

  constructor(
    private userSettingsStorage: BrowserStorage<UserSettingsStorage>,
  ) {
  }

  public get lock(): LockSettingsService {
    if (!this.lockSettingsService) {
      this.lockSettingsService = new LockSettingsService(this.userSettingsStorage.useSection('lock'));
    }

    return this.lockSettingsService;
  }

  public get pdv(): PDVSettingsService {
    if (!this.pdvSettingsService) {
      this.pdvSettingsService = new PDVSettingsService(this.userSettingsStorage.useSection('pdv'));
    }

    return this.pdvSettingsService;
  }

  public clear(): Promise<void> {
    return this.userSettingsStorage.clear();
  }
}
