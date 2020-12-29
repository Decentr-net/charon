import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CoinRateFor24Hours } from '@shared/services/currency';
import { BalanceValueDynamic } from '@shared/services/pdv';
import { HUB_HEADER_META_SLOT } from '../../components/hub-header';
import { HubPageService } from './hub-page.service';

@UntilDestroy()
@Component({
  selector: 'app-hub-page',
  templateUrl: './hub-page.component.html',
  styleUrls: ['./hub-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    HubPageService,
  ],
})
export class HubPageComponent implements OnInit {
  public headerMetaSlotName = HUB_HEADER_META_SLOT;

  public avatar$: Observable<string>;
  public balance: BalanceValueDynamic;
  public coinRate$: Observable<CoinRateFor24Hours>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private hubPageService: HubPageService,
  ) {
  }

  public ngOnInit(): void {
    this.avatar$ = this.hubPageService.getAvatar();
    this.coinRate$ = this.hubPageService.getCoinRateWithMargin();

    this.hubPageService.getBalanceWithMargin().pipe(
      untilDestroyed(this),
    ).subscribe((balance) => {
      this.balance = balance;
      this.changeDetectorRef.detectChanges();
    });
  }
}
