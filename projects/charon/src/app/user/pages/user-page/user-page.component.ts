import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { copyContent } from '@shared/utils/copy-content';
import { AuthService, AuthUser } from '@core/auth';
import { NavigationService } from '@core/navigation';
import { MediaService, NotificationService, SpinnerService } from '@core/services';
import { UserRoute } from '../../user.route';
import { ChartPoint, PDVActivityListItem } from '../../components';
import { UserPageService } from './user-page.service';

@UntilDestroy()
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    UserPageService,
  ],
})
export class UserPageComponent implements OnInit {

  public userRoute: typeof UserRoute = UserRoute;
  public user$: Observable<AuthUser>;
  public coinRate$: Observable<number>;
  public balance$: Observable<string>;
  public pdvList$: Observable<PDVActivityListItem[]>;
  public chartPoints$: Observable<ChartPoint[]>;

  constructor(
    public matchMediaService: MediaService,
    private authService: AuthService,
    private navigationService: NavigationService,
    private router: Router,
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
    private notificationService: NotificationService,
    private userPageService: UserPageService,
  ) {
  }

  ngOnInit(): void {
    this.user$ = this.authService.getActiveUser();

    this.coinRate$ = this.userPageService.getCoinRate();

    this.balance$ = this.userPageService.getBalance();

    this.pdvList$ = this.userPageService.getPDVActivityList();

    this.chartPoints$ = this.userPageService.getPDVChartPoints();
  }

  public openPDVDetails(pdvActivityListItem: PDVActivityListItem): void {
    this.spinnerService.showSpinner();

    this.userPageService.getPDVDetails(pdvActivityListItem.address).pipe(
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(details => {
      this.userPageService.openPDVDetailsDialog(details, pdvActivityListItem.date);
    }, (error) => {
      this.notificationService.error(error);
    });
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
