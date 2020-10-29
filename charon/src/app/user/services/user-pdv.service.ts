import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Environment } from '@environments/environment.definitions';
import { PDVDetails, PDVListItem, PDVService, PDVStatItem } from '../../../../../shared/services/pdv';
import { AuthService } from '@auth/services';
import { ChainService } from '@shared/services/chain';
import { exponentialToFixed } from '@shared/utils/number';

@Injectable()
export class UserPDVService {
  private pdvService: PDVService;

  constructor(
    private authService: AuthService,
    private chainService: ChainService,
    environment: Environment
  ) {
    this.pdvService = new PDVService(environment.restApi);
  }

  public getBalance(): Observable<string> {
    return from(this.pdvService.getBalance(
      this.chainService.getChainId(),
      this.authService.getActiveUserInstant().walletAddress,
    )).pipe(
      map(exponentialToFixed),
    );
  }

  public getPDVList(): Observable<PDVListItem[]> {
    return from(this.pdvService.getPDVList(
      this.chainService.getChainId(),
      this.authService.getActiveUserInstant().walletAddress,
    ));
  }

  public getPDVDetails(address: PDVListItem['address']): Observable<PDVDetails> {
    const { walletAddress, privateKey, publicKey } = this.authService.getActiveUserInstant();
    return from(this.pdvService.getPDVDetails(
      this.chainService.getChainId(),
      address,
      {
        privateKey,
        publicKey,
        address: walletAddress,
      },
    ));
  }

  public getPdvStats(): Observable<PDVStatItem[]> {
    return from(this.pdvService.getPDVStats(
      this.chainService.getChainId(),
      this.authService.getActiveUserInstant().walletAddress,
    ));
  }
}
