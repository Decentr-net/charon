import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CurrencySymbolService } from '../currency-symbol.service';

@Component({
  selector: 'app-currency-symbol',
  styleUrls: ['./currency-symbol.component.scss'],
  templateUrl: './currency-symbol.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencySymbolComponent implements OnInit {
  public symbol$: Observable<string>;

  constructor(
    private currencySymbolService: CurrencySymbolService,
  ) {
  }

  public ngOnInit(): void {
    this.symbol$ = this.currencySymbolService.getSymbol();
  }
}
