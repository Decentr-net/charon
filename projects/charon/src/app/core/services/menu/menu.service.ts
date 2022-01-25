import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mapTo,
  mergeMap,
  shareReplay,
  startWith,
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
  MenuUserProfile,
} from '@shared/components/menu';

import { BankService, PDVService } from '@core/services';
import { isOpenedInTab } from '@shared/utils/browser';
import { Environment } from '@environments/environment.definitions';
import { AppRoute } from '../../../app-route';
import { HubRoute } from '../../../hub';
import { LockService } from '../../lock';
import { NavigationService } from '../../navigation';
import { AuthService } from '../../auth';
import { UserService } from '../user';
import { svgDecentrHub } from '@shared/svg-icons/decentr-hub';
import { svgImportAccount } from '@shared/svg-icons/import-account';
import { svgInformation } from '@shared/svg-icons/information';
import { svgLock } from '@shared/svg-icons/lock';
import { svgLogoIconOrange } from '@shared/svg-icons/logo-icon-orange';
import { svgLogoIconPink } from '@shared/svg-icons/logo-icon-pink';
import { svgLogoIconGreen } from '@shared/svg-icons/logo-icon-green';

const DECENTR_SUPPORT_SITE_URL = 'https://support.decentr.net/';

interface MenuItemsTranslations {
  decentr_hub: {
    description: string;
    title: string;
  };
  decentr_feed: {
    description: string;
    title: string;
  };
  decentr_portal: {
    description: string;
    title: string;
  };
  decentr_explorer: {
    description: string;
    title: string;
  };
  lock: string;
  help: string;
}

@Injectable()
export class MenuService extends MenuBaseService {
  private profile$: Observable<Profile>;

  constructor(
    private authService: AuthService,
    private bankService: BankService,
    private environment: Environment,
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
      svgLock,
      svgLogoIconGreen,
      svgLogoIconOrange,
      svgLogoIconPink,
    ]);

    this.profile$ = this.getProfile().pipe(
      filter((profile) => !!profile),
      shareReplay(1),
    );
  }

  public getUserProfile(): Observable<MenuUserProfile> {
    return this.profile$.pipe(
      map((profile) => ({
        avatar: profile.avatar,
        title: `${profile.firstName} ${profile.lastName ? profile.lastName.slice(0, 1) + '.' : ''}`,
      })),
    );
  }

  public getItems(): Observable<MenuItem[][]> {
    return this.translocoService.selectTranslateObject('menu.items', null, 'core')
      .pipe(
        map((itemsTranslationsObject: MenuItemsTranslations) => [
          [
            {
              action: () => this.router.navigate(['/', AppRoute.Hub]),
              description: itemsTranslationsObject.decentr_hub.description,
              iconKey: svgDecentrHub.name,
              title: itemsTranslationsObject.decentr_hub.title,
            },
            {
              action: () => this.router.navigate(['/', AppRoute.Hub, HubRoute.Feed]),
              description: itemsTranslationsObject.decentr_feed.description,
              iconKey: svgLogoIconPink.name,
              title: itemsTranslationsObject.decentr_feed.title,
            },
            {
              action: () => isOpenedInTab()
                ? this.router.navigate(['/', AppRoute.Portal])
                : this.navigationService.openInNewTab(`/${AppRoute.Portal}`),
              description: itemsTranslationsObject.decentr_portal.description,
              iconKey: svgLogoIconOrange.name,
              title: itemsTranslationsObject.decentr_portal.title,
            },
          ],
          [
            {
              action: () => window.open(this.environment.explorer, '_blank'),
              description: itemsTranslationsObject.decentr_explorer.description,
              iconKey: svgLogoIconGreen.name,
              title: itemsTranslationsObject.decentr_explorer.title,
            },
          ],
          [
            {
              action: () => window.open(DECENTR_SUPPORT_SITE_URL, '_blank'),
              iconKey: svgInformation.name,
              title: itemsTranslationsObject.help,
            },
          ],
          [
            {
              action: () => this.lockService.lock(),
              iconKey: svgLock.name,
              title: itemsTranslationsObject.lock,
            },
          ],
        ])
      );
  }

  public getUserItem(): Observable<MenuUserItem> {
    return combineLatest([
      this.getUserProfile(),
      this.pdvService.getBalance(),
      this.getDECBalance(),
    ]).pipe(
      map(([user, pdvValue, decValue]) => ({
        decValue,
        pdvValue,
        action: () => this.router.navigate(['/', AppRoute.User]),
        title: user.title,
      })),
    );
  }

  public getDECBalance(): Observable<number> {
    return this.bankService.getDECBalance().pipe(
      map(parseFloat),
    );
  }

  public getTranslations(): Observable<MenuTranslations> {
    return this.translocoService.selectTranslateObject('menu', null, 'core');
  }

  public getCloseSource(): Observable<void> {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      mapTo(void 0),
    );
  }

  private getProfile(): Observable<Profile> {
    return this.authService.getActiveUserAddress().pipe(
      switchMap((walletAddress) => this.userService.onProfileChanged(walletAddress).pipe(
        startWith(0),
        mergeMap(() => this.userService.getProfile(walletAddress)),
      )),
      catchError(() => EMPTY),
    );
  }
}
