import { Observable, switchMap } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

interface Chrome {
  decentr: {
    get(key: string, callback: (obj) => unknown): string;

    set(obj: { key: string; value: string }): void;

    onChanged: {
      addListener(callback: (key) => unknown);

      removeListener(callback: (key) => unknown);
    };
  };
}

declare const chrome: Chrome;

type DecentrStorageValue = object | string | number;
type DecentrStorageType = Record<string, DecentrStorageValue>;

export class DecentrStorage<T extends DecentrStorageType> {
  private readonly storage = chrome.decentr;

  public get<K extends keyof T>(key: K): Promise<T[K]> {
    return new Promise<T[K]>((resolve) => {
      this.storage.get(
        key.toString(),
        (obj) => {
          const deserialized = DecentrStorage.deserialize(obj?.[key]) as T[K];
          resolve(deserialized);
        },
      );
    });
  }

  public set<K extends keyof T>(key: K, value: T[K]): void {
    return this.storage.set({
      key: key.toString(),
      value: DecentrStorage.serialize(value),
    });
  }

  public onChange<K extends keyof T>(key: K): Observable<T[K]> {
    return new Observable<T[K]>((subscriber) => {
      const callback = (changedKey) => {
        if (changedKey === key) {
          subscriber.next();
        }
      };

      this.storage.onChanged.addListener(callback);

      return () => this.storage.onChanged.removeListener(callback);
    }).pipe(
      switchMap(() => this.get(key)),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    );
  }

  private static serialize(value: DecentrStorageValue): string {
    return typeof value === 'string'
      ? value
      : JSON.stringify(value);
  }

  private static deserialize(value: string): DecentrStorageValue {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
}
