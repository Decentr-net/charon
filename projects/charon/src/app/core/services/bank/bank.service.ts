import { Injectable } from '@angular/core';
import { BankCoin, TransferData, Wallet } from 'decentr-js';
import { defer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MessageBus } from '@shared/message-bus';
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
    private networkService: NetworkService,
  ) {
  }

  public getDECBalance(walletAddress: Wallet['address']): Observable<BankCoin['amount']> {
    const apiUrl = this.networkService.getActiveNetworkInstant().api;

    return defer(() => this.bankApiService.getCoinBalance(apiUrl, walletAddress)).pipe(
      map((coins) => {
        return coins.find(({ denom }) => denom === 'udec').amount;
      }),
    );
  }

  public transferCoins(receiver: TransferData['to_address'], amount: TransferData['amount']): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.CoinTransfer, {
        transferData: {
          from_address: wallet.address,
          to_address: receiver,
          amount,
        },
        privateKey: wallet.privateKey,
      })
      .then(response => {
        if (!response.success) {
          throw response.error;
        }
      }));
  }
}
