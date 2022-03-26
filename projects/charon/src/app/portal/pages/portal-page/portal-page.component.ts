import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { AppRoute } from '../../../app-route';
import { svgLogoIconOrange } from '@shared/svg-icons/logo-icon-orange';
import { svgWallet } from '@shared/svg-icons/wallet';
import { isOpenedInTab } from '@shared/utils/browser';
import {
  AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT,
  AUTHORIZED_LAYOUT_HEADER_LOGO_SLOT,
  AUTHORIZED_LAYOUT_HEADER_META_SLOT,
} from '@core/layout/authorized-layout';
import { NavigationService } from '@core/navigation';
import { PortalPageService } from './portal-page.service';

@Component({
  selector: 'app-portal-page',
  templateUrl: './portal-page.component.html',
  styleUrls: ['./portal-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PortalPageService,
  ],
})
export class PortalPageComponent implements OnInit {
  @HostBinding('class.mod-popup-view')
  public isOpenedInPopup = !isOpenedInTab();

  public readonly headerActionsSlot = AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT;

  public readonly headerLogoSlot = AUTHORIZED_LAYOUT_HEADER_LOGO_SLOT;

  public readonly headerMetaSlot = AUTHORIZED_LAYOUT_HEADER_META_SLOT;

  public walletAddress$: Observable<string>;

  constructor(
    private navigationService: NavigationService,
    private portalPageService: PortalPageService,
    private router: Router,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgLogoIconOrange,
      svgWallet,
    ]);
  }

  public ngOnInit(): void {
    this.walletAddress$ = this.portalPageService.getWalletAddress();
  }

  public openInTab(): void {
    const dPortalRoute = `/${AppRoute.Portal}`;

    if (isOpenedInTab()) {
      this.router.navigate([dPortalRoute]);
    } else {
      this.navigationService.openInNewTab(dPortalRoute);
    }
  }

  public onWalletAddressCopied(): void {
    this.portalPageService.onWalletAddressCopied();
  }
}
