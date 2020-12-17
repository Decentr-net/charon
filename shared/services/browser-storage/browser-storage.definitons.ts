import { Observable } from 'rxjs';

export interface BrowserStorage<T> {
  get<K extends keyof T>(key: K): Promise<T[K]>;
  set<K extends keyof T>(key: K, value: T[K]): Promise<void>;
  remove(key: keyof T): Promise<void>;
  pop<K extends keyof T>(key: K): Promise<T[K]>;
  clear(): Promise<void>;
  onChange<K extends keyof T>(key: K): Observable<T[K]>;
  useSection<U>(section: string): BrowserStorage<U>;
}
