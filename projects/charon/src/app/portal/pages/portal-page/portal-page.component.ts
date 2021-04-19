import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgWallet } from '@shared/svg-icons';
import {
  AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT,
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
  public readonly headerActionsSlot = AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT;
  public readonly headerMetaSlot = AUTHORIZED_LAYOUT_HEADER_META_SLOT;

  public walletAddress$: Observable<string>;

  constructor(
    private portalPageService: PortalPageService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgWallet,
    ]);
  }

  public ngOnInit(): void {
    this.walletAddress$ = this.portalPageService.getWalletAddress();
  }

  public onWalletAddressCopied(): void {
    this.portalPageService.onWalletAddressCopied();
  }
}
