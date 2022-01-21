import { Injectable } from '@angular/core';
import { combineLatest, defer, Observable, of, ReplaySubject, Subject, timer } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mapTo,
  mergeMap,
  skipWhile,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
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

import { MessageBus } from '@shared/message-bus';
import { ConfigService, NetworkId } from '@shared/services/configuration';
import { PDVStorageService } from '@shared/services/pdv';
import { SettingsService } from '@shared/services/settings';
import { assertMessageResponseSuccess, CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';
import { AuthService } from '../../auth';
import { NetworkService } from '../network';
import { UserApiService } from '../api';
import { ONE_SECOND } from '@shared/utils/date';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authClient: ReplaySubject<DecentrAuthClient> = new ReplaySubject(1);
  private profileClient: ReplaySubject<DecentrProfileClient> = new ReplaySubject(1);

  private profileChanged$: Subject<Wallet['address']> = new Subject();

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private networkService: NetworkService,
    private pdvStorageService: PDVStorageService,
    private settingsService: SettingsService,
    private userApiService: UserApiService,
  ) {
    this.createAuthClient()
      .then((client) => this.authClient.next(client));

    this.createProfileClient()
      .then((client) => this.profileClient.next(client));
  }

  public createUser(email: string, walletAddress: string): Observable<void> {
    return this.userApiService.createUser(email, walletAddress);
  }

  public confirmUser(code: string, email: string): Observable<void> {
    return this.userApiService.confirmUser(code, email);
  }

  public hesoyam(walletAddress: Wallet['address']): Observable<void> {
    return this.userApiService.hesoyam(walletAddress);
  }

  public getAccount(walletAddress: string, networkId?: NetworkId): Observable<Account | undefined> {
    if (networkId) {
      return this.configService.getNetworkConfig(networkId).pipe(
        map((config) => config.network.rest[0]),
        mergeMap((nodeUrl) => DecentrAuthClient.create(nodeUrl)),
        mergeMap((client) => client.getAccount(walletAddress)),
      );
    }

    return this.authClient.pipe(
      take(1),
      switchMap((client) => client.getAccount(walletAddress)),
    );
  }

  public getModeratorAddresses(): Observable<Wallet['address'][]> {
    const nodeUrl = this.networkService.getActiveNetworkAPIInstant();

    return defer(() => DecentrCommunityClient.create(nodeUrl)).pipe(
      mergeMap((client) => client.getModeratorAddresses()),
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
    return this.profileClient.pipe(
      take(1),
      mergeMap((client) => client.getProfile(walletAddress, keys)),
    );
  }

  public getProfiles(walletAddresses: Wallet['address'][], keys?: KeyPair): Observable<Record<Wallet['address'], Profile>> {
    return this.profileClient.pipe(
      take(1),
      mergeMap((client) => client.getProfiles(walletAddresses, keys)),
    );
  }

  public setProfile(profile: ProfileUpdate): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return this.profileClient.pipe(
      mergeMap((client) => client.setProfile(profile, wallet)),
      mapTo(void 0),
      tap(() => this.profileChanged$.next(wallet.address)),
    );
  }

  public resetAccount(
    walletAddress: Wallet['address'],
    privateKey: Wallet['privateKey'],
  ): Observable<void> {
    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.ResetAccount, {
        request: {
          owner: walletAddress,
          address: walletAddress,
        },
        privateKey,
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

  private createAuthClient(): Promise<DecentrAuthClient> {
    const api = this.networkService.getActiveNetworkAPIInstant();

    return DecentrAuthClient.create(api);
  }

  private createProfileClient(): Promise<DecentrProfileClient> {
    return combineLatest([
      this.configService.getCerberusUrl(),
      this.configService.getTheseusUrl(),
    ]).pipe(
      take(1),
      map(([cerberusUrl, theseusUrl]) => new DecentrProfileClient(cerberusUrl, theseusUrl)),
    ).toPromise();
  }
}
