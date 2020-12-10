import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppService } from './app.service';
import { TOOLBAR_HEIGHT } from './app.definitions';
import { ColorValueDynamic } from '@shared/components/color-value-dynamic';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @HostBinding('style.height') public height = TOOLBAR_HEIGHT;

  public avatar$: Observable<string>;
  public balance$: Observable<ColorValueDynamic>;
  public coinRate$: Observable<ColorValueDynamic>;

  constructor(private appService: AppService) {
  }

  public ngOnInit() {
    this.avatar$ = this.appService.getAvatar();
    this.balance$ = this.appService.getBalanceWithMargin();
    this.coinRate$ = this.appService.getCoinRateWithMargin();
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
