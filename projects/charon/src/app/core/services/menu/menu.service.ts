import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  pluck,
  share,
  switchMap,
} from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TranslocoService } from '@ngneat/transloco';
import { Profile } from 'decentr-js';

import {
  MenuItem,
  MenuService as MenuBaseService,
  MenuTranslations,
  MenuUserItem,
  MenuUserProfile
} from '@shared/components/menu';

import { PDVService } from '@shared/services/pdv';
import { isOpenedInTab } from '@shared/utils/browser';
import { AppRoute } from '../../../app-route';
import { HubRoute } from '../../../hub';
import { LockService } from '../../lock';
import { NavigationService } from '../../navigation';
import { AuthService } from '../../auth';
import { UserService } from '../user';
import { svgDecentrHub } from '@shared/svg-icons/decentr-hub';
import { svgImportAccount } from '@shared/svg-icons/import-account';
import { svgInformation } from '@shared/svg-icons/information';
import { svgLockAccount } from '@shared/svg-icons/lock-account';
import { svgLogoIconOrange } from '@shared/svg-icons/logo-icon-orange';
import { svgLogoIconPink } from '@shared/svg-icons/logo-icon-pink';
import { svgLogoIconGreen } from '@shared/svg-icons/logo-icon-green';

const DECENTR_SITE_URL = 'https://decentr.net/';
const DECENTR_EXPLORER_SITE_URL = 'https://explorer.decentr.net';

@Injectable()
export class MenuService extends MenuBaseService {
  private profile$: Observable<Profile>;

  constructor(
    private authService: AuthService,
    private navigationService: NavigationService,
    private pdvService: PDVService,
    private lockService: LockService,
    private router: Router,
    private translocoService: TranslocoService,
    private userService: UserService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    super();

    svgIconRegistry.register([
      svgDecentrHub,
      svgImportAccount,
      svgInformation,
      svgLockAccount,
      svgLogoIconGreen,
      svgLogoIconOrange,
      svgLogoIconPink,
    ]);

    this.profile$ = this.getProfile().pipe(
      filter((profile) => !!profile),
      share(),
    );
  }

  public getUserProfile(): Observable<MenuUserProfile> {
    return this.profile$.pipe(
      map((profile) => ({
        avatar: profile.avatar,
        title: `${profile.firstName} ${profile.lastName ? profile.lastName.slice(0,1) + '.' : ''}`,
      })),
    );
  }

  public getItems(): Observable<MenuItem[][]> {
    return this.translocoService.selectTranslateObject('menu.items', null, 'core')
      .pipe(
        map((itemsTranslationsObject) => [
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
              iconKey: svgLogoIconPink.name,
              title: itemsTranslationsObject['decentr_feed']['title'],
            },
            {
              action: () => isOpenedInTab()
                ? this.router.navigate(['/', AppRoute.Portal])
                : this.navigationService.openInNewTab(`/${AppRoute.Portal}`),
              description: itemsTranslationsObject['decentr_portal']['description'],
              iconKey: svgLogoIconOrange.name,
              title: itemsTranslationsObject['decentr_portal']['title'],
            },
          ],
          [
            {
              action: () => window.open(DECENTR_EXPLORER_SITE_URL, '_blank'),
              description: itemsTranslationsObject['decentr_explorer']['description'],
              iconKey: svgLogoIconGreen.name,
              title: itemsTranslationsObject['decentr_explorer']['title'],
            },
          ],
          [
            {
              action: () => this.lockService.lock(),
              iconKey: svgLockAccount.name,
              title: itemsTranslationsObject['lock'],
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
      this.getUserProfile(),
      this.pdvService.getBalanceLive(),
    ]).pipe(
      map(([user, pdvValue]) => ({
        pdvValue,
        action: () => this.router.navigate(['/', AppRoute.User]),
        title: user.title,
      })),
    );
  }

  public getTranslations(): Observable<MenuTranslations> {
    return this.translocoService.selectTranslateObject('menu', null, 'core');
  }

  private getProfile(): Observable<Profile> {
    return this.authService.getActiveUser().pipe(
      pluck('wallet', 'address'),
      distinctUntilChanged(),
      switchMap((walletAddress) => this.userService.getProfile(walletAddress)),
      catchError(() => EMPTY),
    );
  }
}
