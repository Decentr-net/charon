import { ActivatedRoute, Router } from '@angular/router';
import { BankCoin } from 'decentr-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { BalanceValueDynamic } from '@shared/services/pdv';
import { ChartPoint } from '@shared/components/line-chart';
import { PDVActivityListItem } from '../../components';
import { USER_PAGE_HEADER_SLOT } from '../user-page';
import { UserDetailsPageActivityService } from './user-details-page-activity.service';
import { UserDetailsPageService } from './user-details-page.service';

enum UserDetailsPageTab {
  Activity = 'activity',
  Assets = 'assets',
  PDVRate = 'pdv-rate',
}

@UntilDestroy()
@Component({
  selector: 'app-user-details-page',
  templateUrl: './user-details-page.component.html',
  styleUrls: ['./user-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    UserDetailsPageService,
    UserDetailsPageActivityService,
  ],
})
export class UserDetailsPageComponent implements OnInit {
  public bankBalance: BankCoin['amount'];
  public coinRate$: Observable<number>;
  public balance: BalanceValueDynamic;
  public pdvList$: Observable<PDVActivityListItem[]>;
  public canLoadMoreActivity$: Observable<boolean>;
  public isLoadingActivity$: Observable<boolean>;
  public chartPoints$: Observable<ChartPoint[]>;
  public selectedTabIndex$: BehaviorSubject<number> = new BehaviorSubject(0);
  public showBankBalance$: Observable<boolean>;

  public isTransferHistoryVisible: boolean;
  public userPageHeaderSlotName = USER_PAGE_HEADER_SLOT;

  public readonly tabsEnum: typeof UserDetailsPageTab = UserDetailsPageTab;
  public readonly tabs: UserDetailsPageTab[] = [
    UserDetailsPageTab.PDVRate,
    UserDetailsPageTab.Activity,
    UserDetailsPageTab.Assets,
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private userDetailsPageService: UserDetailsPageService,
    private userDetailsPageActivityService: UserDetailsPageActivityService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.coinRate$ = this.userDetailsPageService.getCoinRate();

    this.userDetailsPageService.getBalanceWithMargin().pipe(
      untilDestroyed(this),
    ).subscribe((balance) => {
      this.balance = balance;
      this.changeDetectorRef.detectChanges();
    });

    this.userDetailsPageService.getBankBalance().pipe(
      untilDestroyed(this),
    ).subscribe((bankBalance) => {
      this.bankBalance = bankBalance;
      this.changeDetectorRef.detectChanges();
    });

    this.pdvList$ = this.userDetailsPageActivityService.activityList$;

    this.canLoadMoreActivity$ = this.userDetailsPageActivityService.canLoadMore$;

    this.isLoadingActivity$ = this.userDetailsPageActivityService.isLoading$;

    this.chartPoints$ = this.userDetailsPageService.getPDVChartPoints();

    this.showBankBalance$ = this.selectedTabIndex$.pipe(
      map((index) => this.tabs[index] === UserDetailsPageTab.Assets),
    );

    this.activatedRoute.fragment.pipe(
      untilDestroyed(this),
    ).subscribe((tab: UserDetailsPageTab) => this.selectedTabIndex$.next(Math.max(this.tabs.indexOf(tab), 0)));
  }

  public showTransferHistory(): void {
    this.isTransferHistoryVisible = true;
  }

  public closeTransferHistory(): void {
    this.isTransferHistoryVisible = false;
    this.changeDetectorRef.markForCheck();
  }

  public openPDVDetails(pdvActivityListItem: PDVActivityListItem): void {
    this.userDetailsPageService.openPDVDetails(pdvActivityListItem);
  }

  public onLoadMoreActivity(): void {
    this.userDetailsPageActivityService.loadMoreActivity();
  }

  public onTabChange(tabIndex: number): void {
    this.selectedTabIndex$.next(tabIndex);

    this.router.navigate(['./'], {
      fragment: this.tabs[tabIndex],
      relativeTo: this.activatedRoute,
      replaceUrl: true,
    });
  }
}
