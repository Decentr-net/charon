import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CoinRateFor24Hours } from '@shared/services/currency';
import { BalanceValueDynamic } from '@shared/services/pdv';
import { AppService } from './app.service';
import { TOOLBAR_HEIGHT } from './app.definitions';
import { NavigationService } from './services';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @HostBinding('style.height') public height = TOOLBAR_HEIGHT;

  public avatar$: Observable<string>;
  public balance: BalanceValueDynamic;
  public coinRate: CoinRateFor24Hours;
  public isLocked: boolean;

  constructor(
    private appService: AppService,
    private navigationService: NavigationService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public ngOnInit() {
    this.avatar$ = this.appService.getAvatar();

    this.appService.getBalanceWithMargin().pipe(
      untilDestroyed(this),
    ).subscribe((balance) => {
      this.balance = balance;
      this.changeDetectorRef.detectChanges();
    });

    this.appService.getCoinRateWithMargin().pipe(
      untilDestroyed(this),
    ).subscribe((coinRate) => {
      this.coinRate = coinRate;
      this.changeDetectorRef.detectChanges();
    });

    this.appService.getLockedState().pipe(
      untilDestroyed(this),
    ).subscribe((isLocked) => {
      this.isLocked = isLocked;
      this.changeDetectorRef.detectChanges();
    });
  }

  public closeApp(): void {
    this.navigationService.closeApp();
  }

  public openCharonHubMyWall(): void {
    this.navigationService.openCharonHubMyWall();
  }

  public openCharonHubOverview(): void {
    this.navigationService.openCharonHubOverview();
  }

  public openCharonHubRecentNews(): void {
    this.navigationService.openCharonHubRecentNews();
  }
}
