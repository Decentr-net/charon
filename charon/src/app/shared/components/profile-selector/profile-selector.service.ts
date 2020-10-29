import { Injectable } from '@angular/core';

import { PDVService } from '../../../../../../shared/services/pdv';
import { Environment } from '@environments/environment.definitions';
import { NetworkService } from '@shared/services/network';
import { combineLatest, from, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import { exponentialToFixed } from '@shared/utils/number';
import { AuthService } from '@auth/services';

@Injectable()
export class ProfileSelectorService {
  private pdvService: PDVService;

  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
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
        pluck('walletAddress'),
      ),
    ]).pipe(
      switchMap(([api, walletAddress]) => this.pdvService.getBalance(api, walletAddress)),
      map(exponentialToFixed),
    );
  }
}
