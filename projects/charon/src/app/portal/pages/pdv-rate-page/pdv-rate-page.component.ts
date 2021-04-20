import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { BalanceValueDynamic } from '@shared/services/pdv';
import { CoinRateFor24Hours } from '@shared/services/currency';
import { PdvRatePageService } from './pdv-rate-page.service';
import { PdvChartPoint } from '../../components/pdv-rate-chart';

@Component({
  selector: 'app-pdv-rate-page',
  templateUrl: './pdv-rate-page.component.html',
  styleUrls: ['./pdv-rate-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PdvRatePageService,
  ],
})
export class PdvRatePageComponent {
  public coinRate$: Observable<CoinRateFor24Hours>;
  public pdvChartPoints$: Observable<PdvChartPoint[]>;
  public pdvRate$: Observable<BalanceValueDynamic>;

  constructor(
    private pdvRateService: PdvRatePageService,
  ) {
  }

  public ngOnInit(): void {
    this.coinRate$ = this.pdvRateService.getCoinRate();
    this.pdvChartPoints$ = this.pdvRateService.getPdvChartPoints();
    this.pdvRate$ = this.pdvRateService.getPdvRateWithMargin();
  }
}
