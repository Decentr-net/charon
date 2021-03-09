import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TranslocoService } from '@ngneat/transloco';

import {
  MenuItem,
  MenuService as MenuBaseService,
  MenuTranslations,
  MenuUserItem,
  MenuUserProfile
} from '@shared/components/menu';
import { svgDecentrHub, svgImportAccount, svgInformation, svgLockAccount } from '@shared/svg-icons';
import { AppRoute } from '../../../app-route';
import { HubRoute } from '../../../hub';
import { UserRoute } from '../../../user';
import { LockService } from '../../lock';
import { NavigationService } from '../../navigation';
import { AuthService } from '../../auth';
import { isOpenedInTab } from '../../browser';
import { PDVService } from '../pdv';

const DECENTR_SITE_URL = 'https://decentr.net/';

@Injectable()
export class MenuService extends MenuBaseService {
  constructor(
    private authService: AuthService,
    private navigationService: NavigationService,
    private pdvService: PDVService,
    private lockService: LockService,
    private router: Router,
    private translocoService: TranslocoService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    super();

    svgIconRegistry.register([
      svgDecentrHub,
      svgImportAccount,
      svgInformation,
      svgLockAccount,
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

  public getItems(): Observable<MenuItem[][]> {
    return this.translocoService.selectTranslateObject('menu.items', null, 'core')
      .pipe(
        map((itemsTranslationsObject) => [
          [
            {
              action: () => this.lockService.lock(),
              iconKey: svgLockAccount.name,
              title: itemsTranslationsObject['lock'],
            },
            {
              iconKey: svgImportAccount.name,
              title: itemsTranslationsObject['import_account'],
            },
          ],
          [
            {
              action: () => this.router.navigate(['/', AppRoute.Hub]),
              description: itemsTranslationsObject['decentr_hub']['description'],
              iconKey: svgDecentrHub.name,
              title: itemsTranslationsObject['decentr_hub']['title'],
            },
            {
              action: () => this.router.navigate(['/', AppRoute.Hub, HubRoute.Feed]),
              description: itemsTranslationsObject['decentr_feed']['description'],
              iconKey: svgDecentrHub.name,
              title: itemsTranslationsObject['decentr_feed']['title'],
            },
            {
              action: () => isOpenedInTab()
                ? this.router.navigate(['/', AppRoute.User])
                : this.navigationService.openInNewTab(`/${AppRoute.User}`),
              description: itemsTranslationsObject['decentr_portal']['description'],
              iconKey: svgDecentrHub.name,
              title: itemsTranslationsObject['decentr_portal']['title'],
            },
          ],
          [
            {
              action: () => window.open(DECENTR_SITE_URL, '_blank'),
              iconKey: svgInformation.name,
              title: itemsTranslationsObject['info_and_help'],
            },
          ]
        ])
      );
  }

  public getUserItem(): Observable<MenuUserItem> {
    return combineLatest([
      this.authService.getActiveUser(),
      this.pdvService.getBalance(),
    ]).pipe(
      map(([user, pdvValue]) => ({
        pdvValue,
        action: () => this.router.navigate(['/', AppRoute.User, UserRoute.Edit]),
        title: `${user.firstName} ${user.lastName}`,
      })),
    );
  }

  public getTranslations(): Observable<MenuTranslations> {
    return this.translocoService.selectTranslateObject('menu', null, 'core')
      .pipe(
        map(({
          coming_soon: comingSoon,
          ...rest
        }) => ({
          ...rest,
          comingSoon,
        })),
      );
  }
}
