import { Injectable } from '@angular/core';
import { combineLatest, Observable, ReplaySubject, switchMap } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CerberusClient, DecentrClient, VulcanClient, TheseusClient } from 'decentr-js';

import { ConfigService, NetworkId } from '@shared/services/configuration';
import { AuthService } from '../../auth';
import { NetworkService } from '../network';

@UntilDestroy()
@Injectable()
export class DecentrService {
  private decentrClient$: ReplaySubject<DecentrClient> = new ReplaySubject(1);

  constructor(
    private configService: ConfigService,
    authService: AuthService,
    networkService: NetworkService,
  ) {
    combineLatest([
      networkService.getActiveNetworkAPI(),
      authService.getActiveUser(),
    ]).pipe(
      switchMap(([api, user]) => {
        console.log(api);
        return DecentrClient.create(api, user?.wallet?.privateKey)
      }),
      untilDestroyed(this),
    ).subscribe((decentrClient) => this.decentrClient$.next(decentrClient));
  }

  public get decentrClient(): Observable<DecentrClient> {
    return this.decentrClient$.pipe(
      take(1),
    );
  }

  public get cerberusClient(): Observable<CerberusClient> {
    return this.configService.getCerberusUrl().pipe(
      map((cerberusUrl) => new CerberusClient(cerberusUrl)),
    );
  }

  public get theseusClient(): Observable<TheseusClient> {
    return this.configService.getTheseusUrl().pipe(
      map((theseusUrl) => new TheseusClient(theseusUrl)),
    );
  }

  public get vulcanClient(): Observable<VulcanClient> {
    return this.configService.getVulcanUrl().pipe(
      map((vulcanUrl) => new VulcanClient(vulcanUrl)),
    );
  }

  public createDecentrClient(networkId: NetworkId): Observable<DecentrClient> {
    return this.configService.getNetworkConfig(networkId).pipe(
      map((config) => config.network.rest[0]),
      mergeMap((nodeUrl) => DecentrClient.create(nodeUrl)),
    );
  }
}
