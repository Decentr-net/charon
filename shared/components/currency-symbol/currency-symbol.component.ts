import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NetworkBrowserStorageService } from '../../services/network-storage';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-currency-symbol',
  styleUrls: ['./currency-symbol.component.scss'],
  templateUrl: './currency-symbol.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencySymbolComponent implements OnInit {
  public symbol$: Observable<string>;

  constructor(
    private networkBrowserStorageService: NetworkBrowserStorageService
  ) {
  }

  public ngOnInit(): void {
    this.symbol$ = this.networkBrowserStorageService.getActiveId().pipe(
      map((networkId) => {
        switch (networkId) {
          case 'testnet': {
            return 'tDEC';
          }
          default: {
            return 'DEC';
          }
        }
      }),
    );
  }
}
