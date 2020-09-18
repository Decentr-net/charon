export abstract class LocalStoreService<T = any> {
  public abstract get(key: string): Promise<T>;
  public abstract set(key: string, value: T): Promise<void>;
  public abstract remove(key: string): Promise<void>;
}

