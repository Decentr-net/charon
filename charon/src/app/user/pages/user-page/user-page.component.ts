import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatchMediaService } from '@shared/services/match-media/match-media.service';
import { BrowserApi } from '@shared/utils/browser-api';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services';
import { EMPTY, Observable } from 'rxjs';
import { AuthUser } from '@auth/models';
import { copyContent } from '@shared/utils/copy-content';
import { CurrencyService } from '@shared/services/currency';
import { UserRoute } from '../../user.route';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@ngneat/transloco';
import { UserPDVService } from '../../services';
import { ActivityItem } from '../../components/activity-list/activity-list.component';
import { catchError, finalize, map } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivityDetails, ActivityDetailsComponent } from '../../components/activity-details';
import { ChartPoint } from '../../components/chart';
import { SpinnerService } from '@shared/services/spinner/spinner.service';

@UntilDestroy()
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent implements OnInit {

  public userRoute: typeof UserRoute = UserRoute;
  public user$: Observable<AuthUser>;
  public rate$: Observable<number>;
  public balance$: Observable<string>;
  public pdvList$: Observable<ActivityItem[]>;
  public chartPoints$: Observable<ChartPoint[]>;

  constructor(
    public matchMediaService: MatchMediaService,
    private currencyService: CurrencyService,
    private authService: AuthService,
    private matDialog: MatDialog,
    private router: Router,
    private spinnerService: SpinnerService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private userPDVService: UserPDVService,
  ) {
  }

  ngOnInit(): void {
    this.user$ = this.authService.getActiveUser();

    this.rate$ = this.currencyService.getCoinRate('decentr', 'usd');

    this.balance$ = this.userPDVService.getBalance();

    this.pdvList$ = this.userPDVService.getPDVList().pipe(
      map((list) => list.map(({ address, timestamp }) => (
        {
          address,
          date: new Date(timestamp),
        }))
      )
    );

    this.chartPoints$ = this.userPDVService.getPdvStats().pipe(
      map((stats) => stats.map(({ date, value }) => ({
        date: new Date(date).valueOf(),
        value,
      }))),
    );
  }

  public openPDVDetails(activityItem: ActivityItem): void {
    this.spinnerService.showSpinner();
    this.userPDVService.getPDVDetails(activityItem.address).pipe(
      catchError(() => {
        this.translocoService.translate('toastr.errors.unknown_error');
        return EMPTY;
      }),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(details => {
      const config: MatDialogConfig<ActivityDetails> = {
        width: '940px',
        maxWidth: '100%',
        height: this.matchMediaService.isSmall() ? '100%' : '500px',
        maxHeight: this.matchMediaService.isSmall() ? '100vh' : '100%',
        panelClass: 'popup-no-padding',
        data: {
          date: activityItem.date,
          domain: details.user_data.pdv.domain,
          ip: details.calculated_data.ip,
          pdvData: details.user_data.pdv.data,
          userAgent: details.user_data.pdv.user_agent,
        },
      };

      this.matDialog.open(ActivityDetailsComponent, config);
    });
  }

  public expandView(): void {
    BrowserApi.openExtensionInNewTab(this.router.url);
  }

  public copyWalletAddress(): void {
    copyContent(this.authService.getActiveUserInstant().walletAddress);

    this.toastrService.success(this.translocoService.translate('user_page.copy_wallet_address_success', null, 'user'));
  }
}
