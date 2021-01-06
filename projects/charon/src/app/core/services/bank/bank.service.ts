import { Injectable } from '@angular/core';
import { BankCoin, Wallet } from 'decentr-js';

import { BankApiService } from '../api';

@Injectable()
export class BankService {
  constructor(
    private bankApiService: BankApiService,
  ) {
  }

  public getDECBalance(apiUrl: string, walletAddress: Wallet['address']): Promise<BankCoin['amount']> {
    return this.bankApiService.getCoinBalance(apiUrl, walletAddress)
      .then((coins) => {
        return coins.find(({ denom }) => denom === 'udec').amount;
      });
  }
}
