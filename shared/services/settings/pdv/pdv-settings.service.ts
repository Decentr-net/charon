import { PDVType } from 'decentr-js';
import { defer, Observable } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';

import { BrowserStorage } from '../../browser-storage';
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
    return defer(() => this.storage.get('collectedTypes')).pipe(
      mergeMap((settings) => this.storage.onChange('collectedTypes').pipe(
        startWith(settings),
      )),
      map((settings) => settings || DEFAULT_COLLECTED_PDV_TYPES_SETTINGS),
    );
  }

  public setCollectedPDVTypes(settings: CollectedPDVTypesSettings): Promise<void> {
    return this.storage.set('collectedTypes', settings);
  }
}
