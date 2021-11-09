import { coerceArray } from '@angular/cdk/coercion';
import { PDV, PDVType } from 'decentr-js';

import { uuid } from '../../../../../shared/utils/uuid';

export class PDVUniqueStore {
  private store = new Map<string, PDV>();

  constructor(pdvData: PDV[] = []) {
    this.set(pdvData);
  }

  public set(pdvData: PDV | PDV[]): this {
    coerceArray(pdvData)
      .forEach((pdv) => this.store.set(PDVUniqueStore.getPDVHash(pdv), pdv));

    return this;
  }

  public getAll(): PDV[] {
    return [...this.store.values()];
  }

  private static getPDVHash(pdv: PDV): string {
    switch (pdv.type) {
      case PDVType.Cookie:
        return [pdv.domain, pdv.path, pdv.name, pdv.secure, pdv.hostOnly, pdv.sameSite].join();
      case PDVType.SearchHistory:
        return [pdv.engine, pdv.query].join();
      case PDVType.AdvertiserId:
        return [pdv.advertiser, pdv.name, pdv.value].join();
      case PDVType.Location:
        return [
          pdv.longitude.toFixed(4),
          pdv.latitude.toFixed(4),
          pdv.requestedBy.host,
          pdv.requestedBy.path,
        ].join();
      default:
        return uuid();
    }
  }
}
