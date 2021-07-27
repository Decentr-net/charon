import { PDVType } from 'decentr-js';
import { defer, Observable } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';

import { BrowserStorage } from '../../browser-storage';
import { BrowserType, detectBrowser } from '../../../utils/browser';
import { CollectedPDVTypesSettings, PDVSettings } from './pdv-settings.definitions';

const IS_DECENTR_BROWSER = detectBrowser() === BrowserType.Decentr;

const DEFAULT_COLLECTED_PDV_TYPES_SETTINGS: CollectedPDVTypesSettings = {
  [PDVType.AdvertiserId]: IS_DECENTR_BROWSER,
  [PDVType.Cookie]: IS_DECENTR_BROWSER,
  [PDVType.Location]: IS_DECENTR_BROWSER,
  [PDVType.SearchHistory]: IS_DECENTR_BROWSER,
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
      map((settings) => ({
        ...DEFAULT_COLLECTED_PDV_TYPES_SETTINGS,
        ...settings,
      })),
    );
  }

  public setCollectedPDVTypes(settings: CollectedPDVTypesSettings): Promise<void> {
    return this.storage.set('collectedTypes', settings);
  }
}
