import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NotificationService } from '@shared/services/notification';
import { BalanceValueDynamic } from '@shared/services/pdv';
import { copyContent } from '@shared/utils/copy-content';
import { AuthService, AuthUser } from '@core/auth';
import { isOpenedInTab } from '@core/browser';
import { NavigationService } from '@core/navigation';
import { MediaService, SpinnerService } from '@core/services';
import { UserRoute } from '../../user.route';
import { ChartPoint, PDVActivityListItem } from '../../components';
import { UserPageService } from './user-page.service';
import { UserPageActivityService } from './user-page-activity.service';

@UntilDestroy()
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    UserPageService,
    UserPageActivityService,
  ],
})
export class UserPageComponent implements OnInit {

  public userRoute: typeof UserRoute = UserRoute;
  public user$: Observable<AuthUser>;
  public coinRate$: Observable<number>;
  public balance: BalanceValueDynamic;
  public pdvList$: Observable<PDVActivityListItem[]>;
  public canLoadMoreActivity$: Observable<boolean>;
  public isLoadingActivity$: Observable<boolean>;
  public chartPoints$: Observable<ChartPoint[]>;
  public isOpenedInTab: boolean;

  constructor(
    public matchMediaService: MediaService,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private navigationService: NavigationService,
    private router: Router,
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
    private notificationService: NotificationService,
    private userPageService: UserPageService,
    private userPageActivityService: UserPageActivityService,
  ) {
  }

  ngOnInit(): void {
    this.user$ = this.authService.getActiveUser();

    this.coinRate$ = this.userPageService.getCoinRate();

    this.userPageService.getBalanceWithMargin().pipe(
      untilDestroyed(this),
    ).subscribe((balance) => {
      this.balance = balance;
      this.changeDetectorRef.detectChanges();
    });

    this.pdvList$ = this.userPageActivityService.activityList$;

    this.canLoadMoreActivity$ = this.userPageActivityService.canLoadMore$;

    this.isLoadingActivity$ = this.userPageActivityService.isLoading$;

    this.chartPoints$ = this.userPageService.getPDVChartPoints();

    this.isOpenedInTab = isOpenedInTab();
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

  public onLoadMoreActivity(): void {
    this.userPageActivityService.loadMoreActivity();
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
