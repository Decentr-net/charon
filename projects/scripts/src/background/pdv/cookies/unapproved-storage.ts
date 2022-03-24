import { CookiePDV } from 'decentr-js';

import { PDVUniqueStore } from '../pdv-unique-store';

export class UnapprovedStorage {
  private storage: CookiePDV[] = [];

  public add(pdv: CookiePDV): void {
    this.storage = new PDVUniqueStore([...this.storage, pdv]).getAll() as CookiePDV[];
  }

  public ejectByDomains(domains: string[]): CookiePDV[] {
    const ejected = this.getByDomains(domains);
    this.storage = this.storage.filter((pdv) => !ejected.includes(pdv));
    return ejected;
  }

  public removeOldDomains(restDomains: string[]): void {
    this.storage = this.getByDomains(restDomains);
  }

  private getByDomains(domains: string[]): CookiePDV[] {
    return this.storage.filter((pdv) => domains.some((domain) => domain.includes(pdv.domain)));
  }
}
