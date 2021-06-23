import { Injectable } from '@angular/core';
import { defer, Observable, of, Subject } from 'rxjs';
import { catchError, delay, filter, mapTo, mergeMap, repeat, retryWhen, skipWhile, take, tap } from 'rxjs/operators';
import { Account, KeyPair, ModeratorAddressesResponse, Profile, ProfileUpdate, Wallet } from 'decentr-js';

import { MessageBus } from '@shared/message-bus';
import { PDVStorageService } from '@shared/services/pdv';
import { SettingsService } from '@shared/services/settings';
import { CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';
import { NetworkService } from '../network';
import { UserApiService } from '../api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private profileChanged$: Subject<Wallet['address']> = new Subject();

  constructor(
    private networkService: NetworkService,
    private pdvStorageService: PDVStorageService,
    private settingsService: SettingsService,
    private userApiService: UserApiService,
  ) {
  }

  public createUser(email: string, walletAddress: string): Observable<void> {
    return this.userApiService.createUser(email, walletAddress);
  }

  public confirmUser(code: string, email: string): Observable<void> {
    return this.userApiService.confirmUser(code, email);
  }

  public getAccount(walletAddress: string): Observable<Account | undefined> {
    return this.userApiService.getAccount(
      this.networkService.getActiveNetworkInstant().api,
      walletAddress,
    );
  }

  public getModeratorAddresses(): Observable<ModeratorAddressesResponse> {
    return this.userApiService.getModeratorAddresses(
      this.networkService.getActiveNetworkInstant().api,
    ).pipe(
      catchError(() => of([])),
    );
  }

  public waitAccount(walletAddress: string): Observable<Account> {
    return this.getAccount(walletAddress).pipe(
      retryWhen(errors => errors.pipe(
        delay(500),
        take(5),
      )),
      delay(500),
      repeat(),
      skipWhile(v => v === undefined),
      take(1),
    );
  }

  public getProfile(walletAddress: string, keys?: KeyPair): Observable<Profile> {
    return this.userApiService.getProfile(walletAddress, keys);
  }

  public getProfiles(walletAddresses: Wallet['address'][], keys?: KeyPair): Observable<Record<Wallet['address'], Profile>> {
    return this.userApiService.getProfiles(walletAddresses, keys);
  }

  public setProfile(profile: ProfileUpdate, wallet: Wallet): Observable<void> {
    return this.userApiService.setProfile({
      ...profile,
      birthday: '1911-11-11',
    }, wallet).pipe(
      tap(() => this.profileChanged$.next(wallet.address)),
    );
  }

  public resetAccount(
    walletAddress: Wallet['address'],
    initiator: Wallet['address'],
    privateKey: Wallet['privateKey'],
  ): Observable<void> {
    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.ResetAccount, {
        walletAddress,
        initiator,
        privateKey,
      })
    ).pipe(
      tap((response) => {
        if (!response.success) {
          throw response.error;
        }
      }),
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

  public resetAccount(
    walletAddress: Wallet['address'],
    initiator: Wallet['address'],
    privateKey: Wallet['privateKey']
  ): Observable<void> {
    return this.userApiService.resetAccount(
      this.networkService.getActiveNetworkInstant().api,
      walletAddress,
      initiator,
      privateKey,
    );
  }
}
