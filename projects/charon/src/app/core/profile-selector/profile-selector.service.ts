import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';

import { Environment } from '@environments/environment.definitions';
import { PDVService } from '@shared/services/pdv';
import { exponentialToFixed } from '@shared/utils/number';
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
