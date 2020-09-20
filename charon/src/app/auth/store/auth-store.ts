export abstract class AuthStore {
  public abstract get(key: string): Promise<string>;
  public abstract set(key: string, value: string): Promise<void>;
  public abstract remove(key: string): Promise<void>;
}
