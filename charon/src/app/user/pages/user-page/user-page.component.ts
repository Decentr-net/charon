import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ActivityDetailsComponent } from '../../components/activity-details';
import { MatchMediaService } from '@shared/services/match-media/match-media.service';
import { BrowserApi } from '@shared/utils/browser-api';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services';
import { Observable } from 'rxjs';
import { AuthUser } from '@auth/models';
import { copyContent } from '@shared/utils/copy-content';
import { CurrencyService } from '@shared/services/currency';
import { UserRoute } from '../../user.route';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@ngneat/transloco';

export interface ActivityItem {
  id: string;
  name: string;
  date: string;
  site: string;
}

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent implements OnInit {

  activityItems: ActivityItem[];
  public userRoute: typeof UserRoute = UserRoute;
  public user$: Observable<AuthUser>;
  public rate$: Observable<number>;

  constructor(
    public dialog: MatDialog,
    public matchMediaService: MatchMediaService,
    private currencyService: CurrencyService,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
  ) {
  }

  ngOnInit(): void {
    this.user$ = this.authService.getActiveUser();
    this.rate$ = this.currencyService.getCoinRate('decentr', 'usd');

    this.activityItems = [
      { id: 'id1', name: 'Cookies name 1', date: '24.07.2020, 11:50', site: 'google.com' },
      { id: 'id1', name: 'Cookies name 2', date: '24.07.2020, 11:50', site: 'decentr.net' },
      { id: 'id1', name: 'Cookies name 3', date: '24.07.2020, 11:50', site: 'yahoo.com' },
      { id: 'id1', name: 'Cookies name 1', date: '24.07.2020, 11:50', site: 'google.com' },
      { id: 'id1', name: 'Cookies name 2', date: '24.07.2020, 11:50', site: 'decentr.net' },
      { id: 'id1', name: 'Cookies name 3', date: '24.07.2020, 11:50', site: 'yahoo.com' },
      { id: 'id1', name: 'Cookies name 1', date: '24.07.2020, 11:50', site: 'google.com' },
      { id: 'id1', name: 'Cookies name 2', date: '24.07.2020, 11:50', site: 'decentr.net' },
      { id: 'id1', name: 'Cookies name 3', date: '24.07.2020, 11:50', site: 'yahoo.com' },
      { id: 'id1', name: 'Cookies name 1', date: '24.07.2020, 11:50', site: 'google.com' },
      { id: 'id1', name: 'Cookies name 2', date: '24.07.2020, 11:50', site: 'decentr.net' },
      { id: 'id1', name: 'Cookies name 3', date: '24.07.2020, 11:50', site: 'yahoo.com' }
    ];
  }

  openActivityItemDetails(id: string) {
    const config = {
      width: '940px',
      maxWidth: '100%',
      height: '500px',
      maxHeight: '100%',
      panelClass: 'popup-no-padding',
      data: { id }
    };

    if (this.matchMediaService.isSmall()) {
      config['height'] = '100%';
      config['maxHeight'] = '100vh';
    }

    this.dialog.open(ActivityDetailsComponent, config);
  }

  public expandView(): void {
    BrowserApi.openExtensionInNewTab(this.router.url);
  }

  public copyWalletAddress(): void {
    copyContent(this.authService.getActiveUserInstant().walletAddress);

    this.toastrService.success(this.translocoService.translate('user_page.copy_wallet_address_success', null, 'user'));
  }

  public trackById: TrackByFunction<ActivityItem> = ({}, { id }) => id;
}
