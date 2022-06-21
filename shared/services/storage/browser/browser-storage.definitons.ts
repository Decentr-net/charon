import { merge, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export abstract class BrowserStorage<T> {
  abstract get<K extends keyof T>(key: K): Promise<T[K]>;
  abstract set<K extends keyof T>(key: K, value: T[K]): Promise<void>;
  abstract remove(key: keyof T): Promise<void>;
  abstract pop<K extends keyof T>(key: K): Promise<T[K]>;
  abstract clear(): Promise<void>;
  abstract onChange<K extends keyof T>(key: K): Observable<T[K]>;
  abstract useSection<U>(section: string): BrowserStorage<U>;

  public observe<K extends keyof T>(key: K): Observable<T[K]> {
    return merge(
      this.onChange(key),
      this.get(key),
    ).pipe(
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    );
  }
}
