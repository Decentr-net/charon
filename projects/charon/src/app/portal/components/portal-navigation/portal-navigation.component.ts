import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgWidescreen } from '@shared/svg-icons/widescreen';
import { NavigationService } from '@core/navigation';
import { AppRoute } from '../../../app-route';
import { PortalRoute } from '../../portal-route';
import { AUTHORIZED_LAYOUT_NAVIGATION_RIGHT_SLOT } from '../../../core/layout/authorized-layout';

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
export class PortalNavigationComponent {

  public readonly links: LinkDef[] = [
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
    {
      colorClass: 'color-primary',
      i18nKey: 'portal.portal_navigation.vpn',
      link: ['/', AppRoute.Portal, PortalRoute.VPN],
    },
  ];

  public readonly navigationRightSlot = AUTHORIZED_LAYOUT_NAVIGATION_RIGHT_SLOT;

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgWidescreen,
    ]);
  }

  public expandView(): void {
    this.navigationService.openInNewTab(this.router.url);
    window.close();
  }
}
