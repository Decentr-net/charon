import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TranslocoService } from '@ngneat/transloco';
import { Wallet } from 'decentr-js';

import { svgDelegate } from '@shared/svg-icons/delegate';
import { svgSend } from '@shared/svg-icons/send';
import { svgWallet } from '@shared/svg-icons/wallet';
import { NetworkId } from '@shared/services/configuration';
import { NotificationService } from '@shared/services/notification';
import { APP_VERSION } from '@shared/utils/version';
import { AuthService } from '@core/auth';
import { AUTHORIZED_LAYOUT_HEADER_META_SLOT } from '@core/layout/authorized-layout';
import { BankService, NetworkService, UserService } from '@core/services';
import { AppRoute } from '../../../app-route';
import { PortalRoute } from '../../../portal';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent implements OnInit {
  @HostBinding('attr.version') public appVersion: string = APP_VERSION;

  public decBalance$: Observable<string>;

  public walletAddress$: Observable<Wallet['address']>;

  public transferRoute: string[] = ['/', AppRoute.Portal, PortalRoute.Assets, PortalRoute.Transfer];

  public stakingRoute: string[] = ['/', AppRoute.Portal, PortalRoute.Staking];

  public readonly headerMetaSlot = AUTHORIZED_LAYOUT_HEADER_META_SLOT;

  public showReferral$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private bankService: BankService,
    private networkService: NetworkService,
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

    this.decBalance$ = this.bankService.getDECBalance();

    this.showReferral$ = this.networkService.getActiveNetworkId().pipe(
      map((networkId) => networkId === NetworkId.Mainnet),
    );
  }

  public onWalletAddressCopied(): void {
    this.notificationService.success(
      this.translocoService.translate('user_page.wallet_address_copied', null, 'user'),
    );
  }
}
