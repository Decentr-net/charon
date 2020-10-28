import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import { Environment } from '@environments/environment.definitions';
import { AuthService } from '@auth/services';
import { ChainService } from '@shared/services/chain';
import { PDVDetails, PDVListItem, PDVService, PDVStatItem } from '../../../../../shared/services/pdv';

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

  public getBalance(): Observable<number> {
    return from(this.pdvService.getBalance(
      this.chainService.getChainId(),
      this.authService.getActiveUserInstant().walletAddress,
    ));
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
