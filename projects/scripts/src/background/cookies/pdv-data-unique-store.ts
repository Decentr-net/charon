import { PDVData } from 'decentr-js';

export class PDVDataUniqueStore {
  private store = new Map<string, PDVData>();

  public set(pdvData: PDVData): this {
    this.store.set(PDVDataUniqueStore.getPDVDataHash(pdvData), pdvData);

    return this;
  }

  public getAll(): PDVData[] {
    return [...this.store.values()];
  }

  private static getPDVDataHash(data: PDVData): string {
    return `${data.domain}-${data.name}-${data.secure}-${data.host_only}-${data.same_site}-${data.type}`;
  }
}
