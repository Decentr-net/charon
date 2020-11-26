import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';

import { PDVService } from '@root-shared/services/pdv';
import { exponentialToFixed } from '@root-shared/utils/number';
import { Environment } from '@environments/environment.definitions';
import { AuthService } from '../auth';
import { NetworkSelectorService } from '../network-selector';

@Injectable()
export class ProfileSelectorService {
  private pdvService: PDVService;

  constructor(
    private authService: AuthService,
    private networkService: NetworkSelectorService,
    environment: Environment
  ) {
    this.pdvService = new PDVService(environment.chainId);
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
