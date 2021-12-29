import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, defer, Observable } from 'rxjs';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import {
  Account,
  DecentrAuthClient,
  DecentrCommunityClient,
  DecentrProfileClient,
  KeyPair,
  Profile,
  ProfileUpdate,
  Wallet,
} from 'decentr-js';

import { ConfigService } from '@shared/services/configuration';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(
    private configService: ConfigService,
    private http: HttpClient,
  ) {
  }

  public createUser(email: string, walletAddress: Wallet['address']): Observable<void> {
    return this.configService.getVulcanUrl().pipe(
      mergeMap((vulcanUrl) => this.http.post<void>(`${vulcanUrl}/v1/register`, {
        address: walletAddress,
        email,
      })),
    );
  }

  public confirmUser(code: string, email: string): Observable<void> {
    return this.configService.getVulcanUrl().pipe(
      mergeMap((vulcanUrl) => this.http.post<void>(`${vulcanUrl}/v1/confirm`, {
        code,
        email,
      })),
    );
  }

  public hesoyam(walletAddress: Wallet['address']): Observable<void> {
    return this.configService.getVulcanUrl().pipe(
      mergeMap((vulcanUrl) => this.http.get<void>(`${vulcanUrl}/v1/hesoyam/${walletAddress}`)),
    );
  }

  public getAccount(api: string, walletAddress: Wallet['address']): Observable<Account | null> {
    return defer(() => DecentrAuthClient.create(api)).pipe(
      mergeMap((client) => client.getAccount(walletAddress)),
    );
  }

  public getModeratorAddresses(api: string): Observable<Wallet['address'][]> {
    return defer(() => DecentrCommunityClient.create(api)).pipe(
      mergeMap((client) => client.getModeratorAddresses()),
    )
  }

  public getProfile(walletAddress: Wallet['address'], keys?: KeyPair): Observable<Profile> {
    return this.createProfileClient().pipe(
      mergeMap((client) => client.getProfile(walletAddress, keys)),
    );
  }

  public getProfiles(walletAddresses: Wallet['address'][], keys?: KeyPair): Observable<Record<Wallet['address'], Profile>> {
    return this.createProfileClient().pipe(
      mergeMap((client) => client.getProfiles(walletAddresses, keys)),
    );
  }

  public setProfile(profile: ProfileUpdate, wallet: Wallet): Observable<void> {
    return this.createProfileClient().pipe(
      mergeMap((client) => client.setProfile(profile, wallet)),
      mapTo(void 0),
    );
  }

  private createProfileClient(): Observable<DecentrProfileClient> {
    return combineLatest([
      this.configService.getCerberusUrl(),
      this.configService.getTheseusUrl(),
    ]).pipe(
      map(([cerberusUrl, theseusUrl]) => new DecentrProfileClient(cerberusUrl, theseusUrl)),
    );
  }
}
