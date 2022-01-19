import { EMPTY, Observable } from 'rxjs';

import { MenuItem, MenuTranslations, MenuUserItem, MenuUserProfile } from './menu.definitions';

export abstract class MenuService {
  public abstract getUserProfile(): Observable<MenuUserProfile>;

  public abstract getItems(): Observable<MenuItem[][]>;

  public abstract getUserItem(): Observable<MenuUserItem>;

  public abstract getTranslations(): Observable<MenuTranslations>;

  public getCloseSource(): Observable<void> {
    return EMPTY;
  }
}
