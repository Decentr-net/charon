export abstract class LocalStoreService {
  public abstract get<T>(key: string): Promise<T>;
  public abstract set<T>(key: string, value: T): Promise<void>;
  public abstract remove(key: string): Promise<void>;
}

