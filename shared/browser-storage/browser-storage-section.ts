import { from, Observable } from 'rxjs';
import { distinctUntilChanged, map, skip, startWith, switchMap } from 'rxjs/operators';
import { BrowserStorage } from './browser-storage.definitons';

export class BrowserStorageSection<T extends {}> implements BrowserStorage<T> {
  constructor(
    private parentStorage: BrowserStorage<Record<string, T>>,
    private section: string,
  ) {
  }

  public async get<K extends keyof T>(key: K): Promise<T[K]> {
    const sectionValue = await this.getSectionValue();
    return Promise.resolve(sectionValue && sectionValue[key]);
  }

  public async set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
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
    return this.parentStorage.remove(this.section);
  }

  public onChange<K extends keyof T>(key: K): Observable<T[K]> {
    return from(this.getSectionValue()).pipe(
      switchMap((sectionValue) => this.parentStorage.onChange(this.section).pipe(
        map((newSectionValue: T) => newSectionValue && newSectionValue[key]),
        startWith(sectionValue[key]),
      )),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      skip(1),
    );
  }

  public useSection<Child>(section: string): BrowserStorage<Child> {
    return new BrowserStorageSection<Child>(this as BrowserStorage<Record<string, Child>>, section);
  }

  private getSectionValue(): Promise<T> {
    return this.parentStorage.get(this.section);
  }

  private setSectionValue(value: T): Promise<void> {
    return this.parentStorage.set(this.section, value);
  }
}
