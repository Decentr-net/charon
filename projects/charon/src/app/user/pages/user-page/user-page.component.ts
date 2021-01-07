import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { NotificationService } from '@shared/services/notification';
import { copyContent } from '@shared/utils/copy-content';
import { AuthService, AuthUser } from '@core/auth';
import { isOpenedInTab } from '@core/browser';
import { NavigationService } from '@core/navigation';
import { MediaService } from '@core/services';
import { UserRoute } from '../../user.route';

export const USER_PAGE_HEADER_SLOT = Symbol('USER_PAGE_HEADER_SLOT');

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent implements OnInit {

  public userRoute: typeof UserRoute = UserRoute;
  public user$: Observable<AuthUser>;
  public isOpenedInTab: boolean;

  public headerSlotName = USER_PAGE_HEADER_SLOT;

  constructor(
    public matchMediaService: MediaService,
    private authService: AuthService,
    private navigationService: NavigationService,
    private router: Router,
    private translocoService: TranslocoService,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.user$ = this.authService.getActiveUser();

    this.isOpenedInTab = isOpenedInTab();
  }

  public expandView(): void {
    this.navigationService.openInNewTab(this.router.url);
  }

  public copyWalletAddress(walletAddress: AuthUser['wallet']['address']): void {
    copyContent(walletAddress);

    this.notificationService.success(
      this.translocoService.translate('user_page.copy_wallet_address_success', null, 'user'),
    );
  }
}
