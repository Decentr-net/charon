import { Observable } from 'rxjs';

import { MenuLink, MenuTranslations, MenuUserLink } from './menu.definitions';

export abstract class MenuService {
  public abstract getAvatarUrl(): Observable<string>;

  public abstract getLinks(): Observable<MenuLink[]>;

  public abstract getUserLink(): Observable<MenuUserLink>;

  public abstract getTranslations(): Observable<MenuTranslations>;

  public abstract lock(): void;
}
