import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AppRoute } from '../../../app-route';
import { PortalRoute } from '../../portal-route';
import { NetworkService } from '@core/services';
import { NetworkId } from '@shared/services/configuration';

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

  constructor(
    private networkService: NetworkService,
  ) {
  }

  public ngOnInit(): void {
    this.links$ = this.networkService.getActiveNetworkId().pipe(
      map((networkId) => [
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
        ...networkId === NetworkId.Mainnet
          ? [{
            colorClass: 'color-primary',
            i18nKey: 'portal.portal_navigation.vpn',
            link: ['/', AppRoute.Portal, PortalRoute.Vpn],
          }]
          : [],
      ]),
    );
  }
}
