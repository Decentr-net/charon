import { Injectable } from '@angular/core';
import { DecentrBankClient, Coin, SendTokensRequest } from 'decentr-js';
import { combineLatest, defer, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { MessageBus } from '@shared/message-bus';
import { assertMessageResponseSuccess, CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';
import { AuthService } from '../../auth';
import { NetworkService } from '../network';

@Injectable()
export class BankService {
  private client: ReplaySubject<DecentrBankClient> = new ReplaySubject(1);

  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
  ) {
    this.createClient()
      .then(client => this.client.next(client));
  }

  public getDECBalance(): Observable<string> {
    return combineLatest([
      this.client,
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([client, walletAddress]) => client.getDenomBalance(walletAddress)),
      map((coin: Coin) => coin?.amount || '0'),
      catchError(() => of('0')),
    );
  }

  public getTransferFee(request: Omit<SendTokensRequest, 'fromAddress'>): Observable<number> {
    return combineLatest([
      this.client,
      this.authService.getActiveUser(),
    ]).pipe(
      switchMap(([client, user]) => client.sendTokens({
        fromAddress: user.wallet.address,
        toAddress: request.toAddress,
        amount: request.amount,
      }, user.wallet.privateKey).simulate()),
    );
  }

  public transferCoins(
    request: Omit<SendTokensRequest, 'fromAddress'>,
    memo?: string,
  ): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.CoinTransfer, {
        request: {
          ...request,
          fromAddress: wallet.address,
        },
        memo,
        privateKey: wallet.privateKey,
      })
    ).pipe(
      map(assertMessageResponseSuccess),
    );
  }

  private createClient(): Promise<DecentrBankClient> {
    const api = this.networkService.getActiveNetworkAPIInstant();

    return DecentrBankClient.create(api);
  }
}
