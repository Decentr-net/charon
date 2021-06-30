import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, switchMap } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TranslocoService } from '@ngneat/transloco';
import { Wallet } from 'decentr-js';

import { svgSend } from '@shared/svg-icons/send';
import { svgWallet } from '@shared/svg-icons/wallet';
import { NotificationService } from '@shared/services/notification';
import { AuthService } from '@core/auth';
import { AUTHORIZED_LAYOUT_HEADER_META_SLOT } from '@core/layout/authorized-layout';
import { UserService } from '@core/services';
import { AppRoute } from '../../../app-route';
import { PortalRoute } from '../../../portal';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent implements OnInit {
  public decBalance$: Observable<string>;

  public walletAddress$: Observable<Wallet['address']>;

  public transferRoute: string[] = ['/', AppRoute.Portal, PortalRoute.Assets, PortalRoute.Transfer];

  public readonly headerMetaSlot = AUTHORIZED_LAYOUT_HEADER_META_SLOT;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private userService: UserService,
    private translocoService: TranslocoService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
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
      switchMap((walletAddress) => this.userService.getAccount(walletAddress)),
      map((account) => account.coins[0].amount),
    );
  }

  public onWalletAddressCopied(): void {
    this.notificationService.success(
      this.translocoService.translate('user_page.wallet_address_copied', null, 'user'),
    );
  }
}
