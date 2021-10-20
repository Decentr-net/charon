import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

import { NetworkBrowserStorageService } from '../../services/network-storage';

@Injectable()
export class CurrencySymbolService {
  constructor(
    private networkBrowserStorageService: NetworkBrowserStorageService
  ) {
  }

  public getSymbol(): Observable<string> {
    return this.networkBrowserStorageService.getActiveId().pipe(
      startWith(this.networkBrowserStorageService.getActiveIdInstant()),
      filter(Boolean),
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
