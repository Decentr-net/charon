import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BankCoin } from 'decentr-js';

import { BalanceValueDynamic } from '@shared/services/pdv';
import { ChartPoint, PDVActivityListItem } from '../../components';
import { USER_PAGE_HEADER_SLOT } from '../user-page';
import { UserDetailsPageActivityService } from './user-details-page-activity.service';
import { UserDetailsPageService } from './user-details-page.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  public bankBalance$: Observable<BankCoin['amount']>;
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

    this.bankBalance$ = this.userDetailsPageService.getBankBalance().pipe(
      share(),
    );

    this.pdvList$ = this.userDetailsPageActivityService.activityList$;

    this.canLoadMoreActivity$ = this.userDetailsPageActivityService.canLoadMore$;

    this.isLoadingActivity$ = this.userDetailsPageActivityService.isLoading$;

    this.chartPoints$ = this.userDetailsPageService.getPDVChartPoints();

    this.showBankBalance$ = this.selectedTabIndex$.pipe(
      map((index) => index === 2),
    );

    this.activatedRoute.fragment.pipe(
      untilDestroyed(this),
    ).subscribe((tabIndex) => this.selectedTabIndex$.next(+tabIndex));
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
    console.log(tabIndex);

    this.router.navigate(['./'], {
      fragment: tabIndex.toString(),
      relativeTo: this.activatedRoute,
      replaceUrl: true,
    });
  }
}
