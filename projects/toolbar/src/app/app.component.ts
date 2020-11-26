import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public balance$: Observable<string>;

  public coinRate$: Observable<number>;

  constructor(private appService: AppService) {
  }

  public ngOnInit() {
    this.balance$ = this.appService.getBalance();

    this.coinRate$ = this.appService.getCoinRate();
  }

  public closeApp(): void {
    this.appService.closeApp();
  }

  public openCharonNews(): void {
    this.appService.openCharonNews();
  }

  public openCharonSettings(): void {
    this.appService.openCharonSettings();
  }
}
