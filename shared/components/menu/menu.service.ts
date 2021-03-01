import { Observable } from 'rxjs';

import { MenuLink, MenuTranslations, MenuUserLink, MenuUserProfile } from './menu.definitions';

export abstract class MenuService {
  public abstract getUserProfile(): Observable<MenuUserProfile>;

  public abstract getLinks(): Observable<MenuLink[]>;

  public abstract getUserLink(): Observable<MenuUserLink>;

  public abstract getTranslations(): Observable<MenuTranslations>;

  public abstract lock(): void;
}
