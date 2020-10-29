import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Environment } from '@environments/environment.definitions';
import { PDVDetails, PDVListItem, PDVService, PDVStatItem } from '../../../../../shared/services/pdv';
import { AuthService } from '@auth/services';
import { exponentialToFixed } from '@shared/utils/number';
import { NetworkService } from '@shared/services/network';

@Injectable()
export class UserPDVService {
  private pdvService: PDVService;

  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
    environment: Environment
  ) {
    this.pdvService = new PDVService(environment.chainId);
  }

  private get networkApi(): string {
    return this.networkService.getActiveNetworkInstant().api;
  }

  public getBalance(): Observable<string> {
    return from(this.pdvService.getBalance(
      this.networkApi,
      this.authService.getActiveUserInstant().walletAddress,
    )).pipe(
      map(exponentialToFixed),
    );
  }

  public getPDVList(): Observable<PDVListItem[]> {
    return from(this.pdvService.getPDVList(
      this.networkApi,
      this.authService.getActiveUserInstant().walletAddress,
    ));
  }

  public getPDVDetails(address: PDVListItem['address']): Observable<PDVDetails> {
    const { walletAddress, privateKey, publicKey } = this.authService.getActiveUserInstant();
    return from(this.pdvService.getPDVDetails(
      this.networkApi,
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
      this.networkApi,
      this.authService.getActiveUserInstant().walletAddress,
    ));
  }
}
