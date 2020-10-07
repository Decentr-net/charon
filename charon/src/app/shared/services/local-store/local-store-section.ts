import { LocalStoreService } from './local-store.service';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export class LocalStoreSection<T extends {} = {}> {
  constructor(
    private localStoreService: LocalStoreService,
    private section: string
  ) {
  }

  public async get<U extends keyof T>(key: U): Promise<T[U]> {
    const sectionValue = await this.getSectionValue();
    return Promise.resolve(sectionValue && sectionValue[key]);
  }

  public async set<U extends keyof T>(key: U, value: T[U]): Promise<void> {
    const sectionValue = await this.getSectionValue();
    const newSectionValue = {
      ...sectionValue,
      [key]: value,
    }
    return this.setSectionValue(newSectionValue);
  }

  public async remove(key: keyof T): Promise<void> {
    const sectionValue = await this.getSectionValue();
    if (sectionValue) {
      delete sectionValue[key];
    }
    return this.setSectionValue(sectionValue);
  }

  public clear(): Promise<void> {
    return this.localStoreService.remove(this.section);
  }

  public onChange<U extends keyof T>(key: U): Observable<T[U]> {
    return this.localStoreService.onChange<T>(this.section).pipe(
      filter((changes) => changes.hasOwnProperty(key)),
      map((changes) => changes[key] as T[U]),
    )
  }

  private getSectionValue(): Promise<T> {
    return this.localStoreService.get(this.section);
  }

  private setSectionValue(value: T): Promise<void> {
    return this.localStoreService.set(this.section, value);
  }
}
