import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { getFollowees, Wallet } from 'decentr-js';

import { ConfigService } from '@shared/services/configuration';

@Injectable()
export class FollowingApiService {
  constructor(
    private configService: ConfigService,
  ) {
  }

  public getFollowees(apiUrl: string, follower: Wallet['address']): Observable<Wallet['address'][]> {
    return this.configService.getChainId().pipe(
      switchMap((chainId) => getFollowees(apiUrl, chainId, follower))
    );
  }
}
