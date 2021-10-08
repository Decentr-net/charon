import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, pluck, switchMap } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TranslocoService } from '@ngneat/transloco';
import { Wallet } from 'decentr-js';

import { version } from '../../../../../../../package.json';
import { svgDelegate } from '@shared/svg-icons/delegate';
import { svgSend } from '@shared/svg-icons/send';
import { svgWallet } from '@shared/svg-icons/wallet';
import { NotificationService } from '@shared/services/notification';
import { AuthService } from '@core/auth';
import { AUTHORIZED_LAYOUT_HEADER_META_SLOT } from '@core/layout/authorized-layout';
import { BankService, UserService } from '@core/services';
import { AppRoute } from '../../../app-route';
import { PortalRoute } from '../../../portal';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent implements OnInit {
  @HostBinding('attr.version') public appVersion: string = version;

  public decBalance$: Observable<string>;

  public walletAddress$: Observable<Wallet['address']>;

  public transferRoute: string[] = ['/', AppRoute.Portal, PortalRoute.Assets, PortalRoute.Transfer];

  public stakingRoute: string[] = ['/', AppRoute.Portal, PortalRoute.Staking];

  public readonly headerMetaSlot = AUTHORIZED_LAYOUT_HEADER_META_SLOT;

  constructor(
    private authService: AuthService,
    private bankService: BankService,
    private notificationService: NotificationService,
    private userService: UserService,
    private translocoService: TranslocoService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgDelegate,
      svgSend,
      svgWallet,
    ]);
  }

  public ngOnInit(): void {
    this.walletAddress$ = this.authService.getActiveUser().pipe(
      pluck('wallet', 'address'),
      distinctUntilChanged(),
    );

    this.decBalance$ = this.walletAddress$.pipe(
      filter((walletAddress) => !!walletAddress),
      switchMap((walletAddress) => this.bankService.getDECBalance(walletAddress)),
    );
  }

  public onWalletAddressCopied(): void {
    this.notificationService.success(
      this.translocoService.translate('user_page.wallet_address_copied', null, 'user'),
    );
  }
}
