import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';

import { PDVService } from '@shared/services/pdv';
import { exponentialToFixed } from '@shared/utils/number';
import { AuthService } from '../auth';
import { NetworkService } from '../services';

@Injectable()
export class ProfileSelectorService {
  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
    private pdvService: PDVService,
  ) {
  }

  public getBalance(): Observable<string> {
    return combineLatest([
      this.networkService.getActiveNetwork().pipe(
        pluck('api'),
      ),
      this.authService.getActiveUser().pipe(
        pluck('wallet', 'address'),
      ),
    ]).pipe(
      switchMap(([api, walletAddress]) => this.pdvService.getBalance(api, walletAddress)),
      map(exponentialToFixed),
    );
  }
}
