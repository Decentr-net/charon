import { Injectable } from '@angular/core';
import {
  BankCoin,
  calculateTransferFee,
  TransferData,
  TXsSearchParameters,
  TXsSearchResponse,
  Wallet,
} from 'decentr-js';
import { defer, Observable } from 'rxjs';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';

import { MessageBus } from '@shared/message-bus';
import { ConfigService } from '@shared/services/configuration';
import { CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';
import { AuthService } from '../../auth';
import { BankApiService } from '../api';
import { NetworkService } from '../network';

@Injectable()
export class BankService {
  constructor(
    private authService: AuthService,
    private bankApiService: BankApiService,
    private configService: ConfigService,
    private networkService: NetworkService,
  ) {
  }

  public getDECBalance(walletAddress: Wallet['address']): Observable<BankCoin['amount']> {
    return this.networkService.getActiveNetworkAPI().pipe(
      switchMap((apiUrl) => this.bankApiService.getCoinBalance(apiUrl, walletAddress)),
      map((coins) => coins.find(({ denom }) => denom === 'udec')?.amount || '0'),
    );
  }

  public getTransferFee(receiver: TransferData['to_address'], amount: TransferData['amount']): Observable<number> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    const transferData: TransferData = {
      from_address: wallet.address,
      to_address: receiver,
      amount,
    };

    return this.configService.getChainId().pipe(
      mergeMap((chainId) => calculateTransferFee(
        this.networkService.getActiveNetworkAPIInstant(),
        chainId,
        transferData,
      )),
      map((fee) => +fee[0].amount),
    );
  }

  public transferCoins(
    receiver: TransferData['to_address'],
    amount: TransferData['amount'],
    comment?: string,
  ): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.CoinTransfer, {
        transferData: {
          from_address: wallet.address,
          to_address: receiver,
          amount,
          comment,
        },
        privateKey: wallet.privateKey,
      })
      .then(response => {
        if (!response.success) {
          throw response.error;
        }
      }));
  }

  public searchTransactions(
    parameters?: TXsSearchParameters,
  ): Observable<TXsSearchResponse> {
    return this.networkService.getActiveNetworkAPI().pipe(
      take(1),
      switchMap((apiUrl) => this.bankApiService.searchTransactions(
        apiUrl,
        parameters,
      )),
    );
  }
}
