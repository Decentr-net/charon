import { BrowserStorage } from '../browser-storage';
import { PDVSettingsService } from './pdv';
import { LockSettingsService } from './lock';
import { UserSettingsStorage } from './settings.definitions';

export class UserSettingsService {
  private lockSettingsService: LockSettingsService;
  private pdvSettingsService: PDVSettingsService;

  constructor(
    private userSettingsStorage: BrowserStorage<UserSettingsStorage>,
  ) {
  }

  public get pdv(): PDVSettingsService {
    if (!this.pdvSettingsService) {
      this.pdvSettingsService = new PDVSettingsService(this.userSettingsStorage.useSection('pdv'));
    }

    return this.pdvSettingsService;
  }

  public get lock(): LockSettingsService {
    if (!this.lockSettingsService) {
      this.lockSettingsService = new LockSettingsService(this.userSettingsStorage.useSection('lock'));
    }

    return this.lockSettingsService;
  }
}
