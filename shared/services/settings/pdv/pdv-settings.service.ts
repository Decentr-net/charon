import { PDVType } from 'decentr-js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BrowserStorage } from '../../storage';
import { CollectedPDVTypesSettings, PDVSettings } from './pdv-settings.definitions';

const DEFAULT_COLLECTED_PDV_TYPES_SETTINGS: CollectedPDVTypesSettings = {
  [PDVType.AdvertiserId]: true,
  [PDVType.Cookie]: true,
  [PDVType.Location]: true,
  [PDVType.SearchHistory]: true,
};

export class PDVSettingsService {
  constructor(
    private storage: BrowserStorage<PDVSettings>,
  ) {
  }

  public getCollectedPDVTypes(): Observable<CollectedPDVTypesSettings> {
    return this.storage.observe('collectedTypes').pipe(
      map((settings) => ({
        ...DEFAULT_COLLECTED_PDV_TYPES_SETTINGS,
        ...settings,
      })),
    );
  }

  public setCollectedPDVTypes(settings: CollectedPDVTypesSettings): Promise<void> {
    return this.storage.set('collectedTypes', settings);
  }

  public getCollectionConfirmed(): Observable<boolean> {
    return this.storage.observe('collectionConfirmed');
  }

  public setCollectionConfirmed(value: boolean): Promise<void> {
    return this.storage.set('collectionConfirmed', value);
  }
}
