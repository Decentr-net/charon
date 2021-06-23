import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Wallet } from 'decentr-js';

import { svgSend } from '@shared/svg-icons/send';
import { svgWallet } from '@shared/svg-icons/wallet';
import { NotificationService } from '@shared/services/notification';
import { BalanceValueDynamic, PDVService } from '@shared/services/pdv';
import { AuthService } from '@core/auth';
import { AUTHORIZED_LAYOUT_HEADER_META_SLOT } from '@core/layout/authorized-layout';
import { AppRoute } from '../../../app-route';
import { PortalRoute } from '../../../portal';

@UntilDestroy()
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent implements OnInit {
  public balanceWithMargin: BalanceValueDynamic;

  public walletAddress$: Observable<Wallet['address']>;

  public transferRoute: string[] = ['/', AppRoute.Portal, PortalRoute.Assets, PortalRoute.Transfer];

  public readonly headerMetaSlot = AUTHORIZED_LAYOUT_HEADER_META_SLOT;

  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private notificationService: NotificationService,
    private pdvService: PDVService,
    private translocoService: TranslocoService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgSend,
      svgWallet,
    ]);
  }

  public ngOnInit(): void {
    this.pdvService.getBalanceWithMarginLive(false).pipe(
      untilDestroyed(this),
    ).subscribe((balanceWithMargin) => {
      this.balanceWithMargin = balanceWithMargin;
      this.changeDetectorRef.detectChanges();
    });

    this.walletAddress$ = this.authService.getActiveUser().pipe(
      pluck('wallet', 'address'),
      distinctUntilChanged(),
    );
  }

  public onWalletAddressCopied(): void {
    this.notificationService.success(
      this.translocoService.translate('user_page.wallet_address_copied', null, 'user'),
    );
  }
}
