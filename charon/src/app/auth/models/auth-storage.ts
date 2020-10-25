import { Observable } from 'rxjs';

export abstract class AuthStorage<User extends { id: string } = { id: string }> {
  public abstract getUsers(): Observable<User[]>;
  public abstract removeUser(id: User['id']): Promise<void>;
  public abstract setActiveUserId(id: User['id']): Promise<void>;
  public abstract removeActiveUserId(): Promise<void>;
  public abstract getActiveUser(): Observable<User>;
  public abstract createUser(user: User): Promise<void>
  public abstract updateUser(id: User['id'], user: Partial<Omit<User, 'id'>>): Promise<void>;
}
