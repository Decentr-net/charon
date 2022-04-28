import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { BrowserStorage } from './browser-storage.definitons';

export class BrowserStorageSection<T> extends BrowserStorage<T> {
  constructor(
    private parentStorage: BrowserStorage<Record<string, T>>,
    private section: string,
  ) {
    super();
  }

  public async get<K extends keyof T>(key: K): Promise<T[K]> {
    const sectionValue = await this.getSectionValue();

    return sectionValue && sectionValue[key];
  }

  public async set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    const sectionValue = await this.getSectionValue();
    const newSectionValue = {
      ...sectionValue as T,
      [key]: value,
    };
    return this.setSectionValue(newSectionValue as T);
  }

  public async remove(key: keyof T): Promise<void> {
    const sectionValue = await this.getSectionValue();
    if (sectionValue) {
      delete sectionValue[key];
    }
    return this.setSectionValue(sectionValue);
  }

  public async pop<K extends keyof T>(key: K): Promise<T[K]> {
    const value = await this.get(key);
    await this.remove(key);
    return value;
  }

  public clear(): Promise<void> {
    return this.parentStorage.remove(this.section);
  }

  public onChange<K extends keyof T>(key: K): Observable<T[K] | undefined> {
    return this.parentStorage.onChange(this.section).pipe(
      map((newSectionValue: T) => newSectionValue && newSectionValue[key]),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    );
  }

  public useSection<Child>(section: string): BrowserStorage<Child> {
    return new BrowserStorageSection<Child>(this as unknown as BrowserStorage<Record<keyof T, Child>>, section);
  }

  private getSectionValue(): Promise<T> {
    return this.parentStorage.get(this.section);
  }

  private setSectionValue(value: T): Promise<void> {
    return this.parentStorage.set(this.section, value);
  }
}
