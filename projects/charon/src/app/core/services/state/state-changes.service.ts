import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { AuthService, AuthUser } from '../../auth';
import { Network, NetworkService } from '../network';

@Injectable()
export class StateChangesService {
  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
  ) {
  }

  public getWalletAndNetworkApiChanges(): Observable<{
    wallet: AuthUser['wallet'];
    networkApi: Network['api'];
  }> {
    return combineLatest([
      this.authService.getActiveUser().pipe(
        pluck('wallet'),
      ),
      this.networkService.getActiveNetwork().pipe(
        pluck('api')
      ),
    ]).pipe(
      map(([wallet, networkApi]) => ({ wallet, networkApi })),
    );
  }
}
