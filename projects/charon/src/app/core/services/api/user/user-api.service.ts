import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defer, Observable } from 'rxjs';
import { mapTo, mergeMap } from 'rxjs/operators';
import {
  Account,
  getAccount,
  getModeratorAddresses,
  getProfile,
  getProfiles,
  Profile,
  ProfileUpdate,
  saveProfile,
  Wallet,
} from 'decentr-js';

import { Environment } from '@environments/environment.definitions';
import { ConfigService } from '@shared/services/configuration';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(
    private configService: ConfigService,
    private environment: Environment,
    private http: HttpClient,
  ) {
  }

  public createUser(email: string, walletAddress: Wallet['address']): Observable<void> {
    return this.configService.getVulcanUrl().pipe(
      mergeMap((vulcanUrl) => this.http.post<void>(`${vulcanUrl}/v1/register`, {
          address: walletAddress,
          email,
        })
      ),
    );
  }

  public confirmUser(code: string, email: string): Observable<void> {
    return this.configService.getVulcanUrl().pipe(
      mergeMap((vulcanUrl) => this.http.post<void>(`${vulcanUrl}/v1/confirm`, {
          code,
          email,
        })
      ),
    );
  }

  public getAccount(api: string, walletAddress: Wallet['address']): Observable<Account> {
    return defer(() => getAccount(api, walletAddress));
  }

  public getModeratorAddresses(api: string): Observable<string[]> {
    return defer(() => getModeratorAddresses(api));
  }

  public getProfile(walletAddress: Wallet['address']): Observable<Profile> {
    return this.configService.getCerberusUrl().pipe(
      mergeMap((cerberusUrl) => getProfile(cerberusUrl, walletAddress)),
    );
  }

  public getProfiles(walletAddresses: Wallet['address'][]): Observable<Record<Wallet['address'], Profile>> {
    return this.configService.getCerberusUrl().pipe(
      mergeMap((cerberusUrl) => getProfiles(cerberusUrl, walletAddresses)),
    );
  }

  public setProfile(profile: ProfileUpdate, wallet: Wallet): Observable<void> {
    return this.configService.getCerberusUrl().pipe(
      mergeMap((cerberusUrl) => saveProfile(cerberusUrl, profile, wallet)),
      mapTo(void 0),
    );
  }
}
