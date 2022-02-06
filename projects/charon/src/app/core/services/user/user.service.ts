import { Injectable } from '@angular/core';
import { defer, Observable, of, Subject, timer } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMap, skipWhile, switchMap, take, tap, } from 'rxjs/operators';
import { Account, KeyPair, Profile, ProfileUpdate, Wallet, } from 'decentr-js';

import { MessageBus } from '@shared/message-bus';
import { NetworkId } from '@shared/services/configuration';
import { PDVStorageService } from '@shared/services/pdv';
import { SettingsService } from '@shared/services/settings';
import { ONE_SECOND } from '@shared/utils/date';
import { assertMessageResponseSuccess, CharonAPIMessageBusMap } from '@scripts/background/charon-api/message-bus-map';
import { MessageCode } from '@scripts/messages';
import { AuthService } from '../../auth';
import { DecentrService } from '../decentr';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private profileChanged$: Subject<Wallet['address']> = new Subject();

  constructor(
    private authService: AuthService,
    private decentrService: DecentrService,
    private pdvStorageService: PDVStorageService,
    private settingsService: SettingsService,
  ) {
  }

  public createUser(email: string, walletAddress: string): Observable<void> {
    return this.decentrService.createVulcanClient(NetworkId.Mainnet).pipe(
      mergeMap((vulcanClient) => vulcanClient.registration.register(walletAddress, email)),
    );
  }

  public confirmUser(code: string, email: string): Observable<void> {
    return this.decentrService.createVulcanClient(NetworkId.Mainnet).pipe(
      mergeMap((vulcanClient) => vulcanClient.registration.confirm(email, code)),
    );
  }

  public hesoyam(walletAddress: Wallet['address']): Observable<void> {
    return this.decentrService.createVulcanClient(NetworkId.Testnet).pipe(
      mergeMap((vulcanClient) => vulcanClient.registration.hesoyam(walletAddress)),
    );
  }

  public getAccount(walletAddress: string, networkId?: NetworkId): Observable<Account | undefined> {
    const decentrClient = networkId
      ? this.decentrService.createDecentrClient(networkId)
      : this.decentrService.decentrClient;

    return decentrClient.pipe(
      mergeMap((decentrClient) => decentrClient.auth.getAccount(walletAddress))
    );
  }

  public getModeratorAddresses(): Observable<Wallet['address'][]> {
    return this.decentrService.decentrClient.pipe(
      mergeMap((decentrClient) => decentrClient.community.getModeratorAddresses()),
      catchError(() => of([])),
    );
  }

  public waitAccount(walletAddress: string, networkId?: NetworkId): Observable<Account> {
    return timer(0, ONE_SECOND).pipe(
      switchMap(() => this.getAccount(walletAddress, networkId)),
      skipWhile((account) => !account),
      take(1),
    );
  }

  public createTestnetAccount(walletAddress: Wallet['address']): Observable<void> {
    return this.getAccount(walletAddress, NetworkId.Testnet).pipe(
      mergeMap((account) => account
        ? of(void 0)
        : this.hesoyam(walletAddress).pipe(
          mergeMap(() => this.waitAccount(walletAddress, NetworkId.Testnet)),
        )
      ),
      mapTo(void 0),
      take(1),
      catchError(() => of(void 0)),
    );
  }

  public getProfile(walletAddress: string, keys?: KeyPair): Observable<Profile> {
    return this.decentrService.cerberusClient.pipe(
      mergeMap((cerberusClient) => cerberusClient.profile.getProfile(walletAddress, keys)),
    );
  }

  public getProfiles(walletAddresses: Wallet['address'][], keys?: KeyPair): Observable<Record<Wallet['address'], Profile>> {
    return this.decentrService.cerberusClient.pipe(
      mergeMap((cerberusClient) => cerberusClient.profile.getProfiles(walletAddresses, keys)),
    );
  }

  public setProfile(profile: ProfileUpdate): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return this.decentrService.cerberusClient.pipe(
      mergeMap((cerberusClient) => cerberusClient.profile.setProfile(profile, wallet)),
      mapTo(void 0),
      tap(() => this.profileChanged$.next(wallet.address)),
    );
  }

  public resetAccount(
    walletAddress: Wallet['address'],
  ): Observable<void> {
    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.ResetAccount, {
        request: {
          owner: walletAddress,
          address: walletAddress,
        },
      })
    ).pipe(
      map(assertMessageResponseSuccess),
      mergeMap(() => this.settingsService.getUserSettingsService(walletAddress).clear()),
      mergeMap(() => this.pdvStorageService.clearUserPDV(walletAddress)),
    );
  }

  public onProfileChanged(walletAddress: Wallet['address']): Observable<void> {
    return this.profileChanged$.pipe(
      filter((walletAddressChanged) => walletAddressChanged === walletAddress),
      mapTo(void 0),
    );
  }
}
