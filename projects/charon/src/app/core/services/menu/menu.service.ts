import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TranslocoService } from '@ngneat/transloco';

import {
  MenuLink,
  MenuService as MenuBaseService,
  MenuTranslations,
  MenuUserLink,
  MenuUserProfile
} from '@shared/components/menu';
import { getCharonPageUrl } from '@shared/utils/navigation';
import { svgDecentrHub, svgImport, svgInformation } from '@shared/svg-icons';
import { AppRoute } from '../../../app-route';
import { HubFeedRoute, HubRoute } from '../../../hub';
import { UserRoute } from '../../../user';
import { LockService } from '../../lock';
import { AuthService } from '../../auth';
import { isOpenedInTab } from '../../browser';
import { PDVService } from '../pdv';

@Injectable()
export class MenuService extends MenuBaseService {
  constructor(
    private authService: AuthService,
    private pdvService: PDVService,
    private lockService: LockService,
    private translocoService: TranslocoService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    super();

    svgIconRegistry.register([
      svgDecentrHub,
      svgImport,
      svgInformation,
    ]);
  }

  public getUserProfile(): Observable<MenuUserProfile> {
    return this.authService.getActiveUser().pipe(
      map((user) => ({
        avatar: user.avatar,
        firstName: user.firstName,
        lastName: user.lastName,
      })),
    )
  }

  public getLinks(): Observable<MenuLink[]> {
    return this.translocoService.selectTranslateObject('menu.links', null, 'core')
      .pipe(
        map((linksTranslationsObject) => [
          {
            iconKey: svgDecentrHub.name,
            link: `/${AppRoute.Hub}`,
            title: linksTranslationsObject['decentr_hub'],
          },
          {
            iconKey: svgDecentrHub.name,
            link: `/${AppRoute.Hub}/${HubRoute.Feed}/${HubFeedRoute.MyWall}`,
            title: linksTranslationsObject['decentr_feed'],
          },
          {
            blank: !isOpenedInTab(),
            iconKey: svgDecentrHub.name,
            link: isOpenedInTab() ? `/${AppRoute.User}` : getCharonPageUrl(AppRoute.User),
            title: linksTranslationsObject['decentr_portal'],
          },
          {
            iconKey: svgImport.name,
            title: linksTranslationsObject['import_account'],
          },
          {
            blank: true,
            iconKey: svgInformation.name,
            link: 'https://decentr.net/',
            title: linksTranslationsObject['info_and_help'],
          },
        ])
      );
  }

  public getUserLink(): Observable<MenuUserLink> {
    return combineLatest([
      this.authService.getActiveUser(),
      this.pdvService.getBalance(),
    ]).pipe(
      map(([user, pdvValue]) => ({
        pdvValue,
        link: `/${AppRoute.User}/${UserRoute.Edit}`,
        title: `${user.firstName} ${user.lastName}`,
      })),
    );
  }

  public getTranslations(): Observable<MenuTranslations> {
    return this.translocoService.selectTranslateObject('menu', null, 'core')
      .pipe(
        map(({
          coming_soon: comingSoon,
          my_accounts: myAccounts,
          ...rest
        }) => ({
          ...rest,
          comingSoon,
          myAccounts,
        })),
      );
  }

  public lock(): void {
    this.lockService.lock();
  }
}
