import { Injectable } from '@angular/core';
import { DecentrBankClient, Coin, SendTokensRequest } from 'decentr-js';
import { combineLatest, defer, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { MessageBus } from '@shared/message-bus';
import { assertMessageResponseSuccess, CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';
import { AuthService } from '../../auth';
import { NetworkService } from '../network';

@Injectable()
export class BankService {
  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
  ) {
  }

  public getDECBalance(): Observable<string> {
    return combineLatest([
      this.createAPIClient(),
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([client, walletAddress]) => client.getDenomBalance(walletAddress)),
      map((coin: Coin) => coin?.amount || '0'),
      catchError(() => of('0')),
    );
  }

  public getTransferFee(request: Omit<SendTokensRequest, 'fromAddress'>): Observable<number> {
    return combineLatest([
      DecentrBankClient.create(this.networkService.getActiveNetworkAPIInstant()),
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

  // public searchTransactions(
  //   parameters?: TXsSearchParameters,
  // ): Observable<TXsSearchResponse> {
  //   return this.networkService.getActiveNetworkAPI().pipe(
  //     take(1),
  //     switchMap((apiUrl) => this.bankApiService.searchTransactions(
  //       apiUrl,
  //       parameters,
  //     )),
  //   );
  // }

  private createAPIClient(): Promise<DecentrBankClient> {
    const api = this.networkService.getActiveNetworkAPIInstant();

    return DecentrBankClient.create(api);
  }
}
