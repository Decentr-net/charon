import { CookiePDV } from 'decentr-js';

export class UnapprovedStorage {
  private storage: CookiePDV[] = [];

  public add(pdv: CookiePDV): void {
    this.storage = ([...this.storage, pdv]);
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
