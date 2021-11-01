import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

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
  styleUrls: ['./portal-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalNavigationComponent implements OnInit {

  public links: LinkDef[];

  public ngOnInit(): void {
    this.links = [
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
        i18nKey: 'portal.portal_navigation.staking',
        link: ['/', AppRoute.Portal, PortalRoute.Staking],
      },
    ];
  }
}
