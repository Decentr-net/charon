import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoute } from '../../../app-route';
import { PortalRoute } from '../../portal-route';

interface LinkDef {
  colorClass: string;
  link: string[];
  i18nKey: string;
}

@Component({
  selector: 'app-portal-navigation',
  templateUrl: './portal-navigation.component.html',
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
  ];
}
