import { Injectable } from '@angular/core';

import { getBankBalances, BankCoin, Wallet } from 'decentr-js';

@Injectable()
export class BankApiService {
  public getCoinBalance(apiUrl: string, walletAddress: Wallet['address']): Promise<BankCoin[]> {
    return getBankBalances(apiUrl, walletAddress);
  }
}
