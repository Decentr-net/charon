import { Injectable } from '@angular/core';
import { Coin, SendIbcTokensRequest, SendTokensRequest } from 'decentr-js';
import { combineLatest, defer, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { MessageBus } from '@shared/message-bus';
import { assertMessageResponseSuccess, CharonAPIMessageBusMap } from '@scripts/background/charon-api/message-bus-map';
import { MessageCode } from '@scripts/messages';
import { AuthService } from '../../auth';
import { DecentrService } from '../decentr';

enum IbcChannel {
  DecentrSentinel = 'channel-4',
}

enum IbcPort {
  Transfer = 'transfer',
}

const IBC_TIMEOUT: number = 60;

export const IbcRequestParams = {
  channel: IbcChannel,
  port: IbcPort,
  timeout: IBC_TIMEOUT,
};

@Injectable()
export class BankService {
  constructor(
    private authService: AuthService,
    private decentrService: DecentrService,
  ) {
  }

  public getDECBalance(): Observable<string> {
    return combineLatest([
      this.decentrService.decentrClient,
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([client, walletAddress]) => client.bank.getDenomBalance(walletAddress)),
      map((coin: Coin) => coin?.amount || '0'),
      catchError(() => of('0')),
    );
  }

  public getTransferFee(request: Omit<SendTokensRequest, 'fromAddress'>): Observable<number> {
    return this.decentrService.decentrClient.pipe(
      switchMap((client) => client.bank.sendTokens({
        fromAddress: this.authService.getActiveUserInstant().wallet.address,
        toAddress: request.toAddress,
        amount: request.amount,
      }).simulate()),
    );
  }

  public getTransferIbcFee(request: Pick<SendIbcTokensRequest, 'receiver' | 'token'>): Observable<number> {
    return this.decentrService.decentrClient.pipe(
      switchMap((client) => client.bank.sendIbcTokens({
        receiver: request.receiver,
        sender: this.authService.getActiveUserInstant().wallet.address,
        sourcePort: IbcRequestParams.port.Transfer,
        sourceChannel: IbcRequestParams.channel.DecentrSentinel,
        timeoutSec: IbcRequestParams.timeout,
        token: request.token,
      }).simulate()),
    );
  }

  public transferCoins(
    request: Omit<SendTokensRequest, 'fromAddress'>,
    memo?: string,
  ): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>().sendMessage(
      MessageCode.CoinTransfer,
      {
        request: {
          ...request,
          fromAddress: wallet.address,
        },
        memo,
      },
    )).pipe(
      map(assertMessageResponseSuccess),
    );
  }

  public sendIbcTokens(
    request: SendIbcTokensRequest,
    memo?: string,
  ): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus().sendMessage(
      MessageCode.SendIbcTokens,
      {
        request: {
          ...request,
          fromAddress: wallet.address,
        },
        memo,
      },
    )).pipe(
      map(assertMessageResponseSuccess),
    );
  }
}
