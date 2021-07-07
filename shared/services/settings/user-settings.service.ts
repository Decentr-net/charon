import { BrowserStorage } from '../browser-storage';
import { PDVSettingsService } from './pdv';
import { UserSettingsStorage } from './settings.definitions';

export class UserSettingsService {
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
}
