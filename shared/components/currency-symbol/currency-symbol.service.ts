import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { NetworkBrowserStorageService } from '../../services/network-storage';

@Injectable()
export class CurrencySymbolService {
  constructor(
    private networkBrowserStorageService: NetworkBrowserStorageService,
  ) {
  }

  public getSymbol(): Observable<string> {
    return this.networkBrowserStorageService.getActiveId().pipe(
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
