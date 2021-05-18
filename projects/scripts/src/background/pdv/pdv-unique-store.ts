import { PDV, PDVType } from 'decentr-js';

import { uuid } from '../../../../../shared/utils/uuid';

export class PDVUniqueStore {
  private store = new Map<string, PDV>();

  public set(pdvData: PDV): this {
    this.store.set(PDVUniqueStore.getPDVHash(pdvData), pdvData);

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
      default:
        return uuid();
    }
  }
}
