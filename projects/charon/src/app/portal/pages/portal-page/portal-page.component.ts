import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { ToolbarStateService } from '@shared/services/toolbar-state';
import { svgLogoIconOrange } from '@shared/svg-icons/logo-icon-orange';
import { svgLogoPortal } from '@shared/svg-icons/logo-portal';
import { svgWallet } from '@shared/svg-icons/wallet';
import { isOpenedInTab } from '@shared/utils/browser';
import {
  AUTHORIZED_LAYOUT_FOOTER_SLOT,
  AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT,
  AUTHORIZED_LAYOUT_HEADER_LOGO_SLOT,
  AUTHORIZED_LAYOUT_HEADER_META_SLOT,
} from '@core/layout/authorized-layout';
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
  public isOpenedInPopup: boolean = !isOpenedInTab();

  public readonly footerSlot = AUTHORIZED_LAYOUT_FOOTER_SLOT;
  public readonly headerActionsSlot = AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT;
  public readonly headerLogoSlot = AUTHORIZED_LAYOUT_HEADER_LOGO_SLOT;
  public readonly headerMetaSlot = AUTHORIZED_LAYOUT_HEADER_META_SLOT;

  public toolbarEnabledState$: Observable<boolean>;

  public walletAddress$: Observable<string>;

  constructor(
    private portalPageService: PortalPageService,
    svgIconRegistry: SvgIconRegistry,
    private toolbarStateService: ToolbarStateService
  ) {
    svgIconRegistry.register([
      svgLogoIconOrange,
      svgLogoPortal,
      svgWallet,
    ]);
  }

  public ngOnInit(): void {
    this.toolbarEnabledState$ = this.toolbarStateService.getEnabledState();

    this.walletAddress$ = this.portalPageService.getWalletAddress();
  }

  public onToolbarEnabledStateChange(state: boolean): void {
    this.toolbarStateService.setEnabledState(state);
  }

  public onWalletAddressCopied(): void {
    this.portalPageService.onWalletAddressCopied();
  }
}
