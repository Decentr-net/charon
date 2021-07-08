import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgWidescreen } from '@shared/svg-icons/widescreen';
import { ConfigService } from '@shared/services/configuration';
import { NavigationService } from '@core/navigation';
import { AppRoute } from '../../../app-route';
import { PortalRoute } from '../../portal-route';
import { AUTHORIZED_LAYOUT_NAVIGATION_RIGHT_SLOT } from '../../../core/layout/authorized-layout';
import { BrowserType, detectBrowser } from '@shared/utils/browser';

const CURRENT_BROWSER_TYPE: BrowserType = detectBrowser();

interface LinkDef {
  colorClass: string;
  link: string[];
  i18nKey: string;
}

@Component({
  selector: 'app-portal-navigation',
  templateUrl: './portal-navigation.component.html',
  styleUrls: ['./portal-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalNavigationComponent implements OnInit {

  public links$: Observable<LinkDef[]>;

  public readonly navigationRightSlot = AUTHORIZED_LAYOUT_NAVIGATION_RIGHT_SLOT;

  constructor(
    private configService: ConfigService,
    private navigationService: NavigationService,
    private router: Router,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgWidescreen,
    ]);
  }

  public ngOnInit(): void {
    this.links$ = this.configService.getVPNSettings().pipe(
      map((vpnSettings) => [
        {
          colorClass: 'color-primary',
          i18nKey: 'portal.portal_navigation.pdv_rate',
          link: ['/', AppRoute.Portal, PortalRoute.PDVRate],
        },
        {
          colorClass: 'color-primary',
          i18nKey: 'portal.portal_navigation.activity',
          link: ['/', AppRoute.Portal, PortalRoute.Activity],
        },
        {
          colorClass: 'color-primary',
          i18nKey: 'portal.portal_navigation.assets',
          link: ['/', AppRoute.Portal, PortalRoute.Assets],
        },
        ...(vpnSettings.enabled && CURRENT_BROWSER_TYPE !== BrowserType.Decentr) ? [{
          colorClass: 'color-primary',
          i18nKey: 'portal.portal_navigation.vpn',
          link: ['/', AppRoute.Portal, PortalRoute.VPN],
        }] : [],
      ]),
    );
  }

  public expandView(): void {
    this.navigationService.openInNewTab(this.router.url);
    window.close();
  }
}
