import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ColorValueDynamic } from '@shared/components/color-value-dynamic';
import { AppService } from './app.service';
import { TOOLBAR_HEIGHT } from './app.definitions';

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
  public balance: ColorValueDynamic;
  public coinRate: ColorValueDynamic;

  constructor(
    private appService: AppService,
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
  }

  public closeApp(): void {
    this.appService.closeApp();
  }

  public openCharonHubMyWall(): void {
    this.appService.openCharonHubMyWall();
  }

  public openCharonHubOverview(): void {
    this.appService.openCharonHubOverview();
  }

  public openCharonHubRecentNews(): void {
    this.appService.openCharonHubRecentNews();
  }

  public openCharonUserSettings(): void {
    this.appService.openCharonUserSettings();
  }
}
