import { Injectable } from '@angular/core';
import {
  BankCoin,
  getBankBalances,
  searchTransactions,
  TXsSearchParameters,
  TXsSearchResponse,
  Wallet,
} from 'decentr-js';

@Injectable()
export class BankApiService {
  public getCoinBalance(apiUrl: string, walletAddress: Wallet['address']): Promise<BankCoin[]> {
    return getBankBalances(apiUrl, walletAddress);
  }

  public searchTransactions(
    apiUrl: string,
    parameters?: TXsSearchParameters,
  ): Promise<TXsSearchResponse> {
    return searchTransactions(
      apiUrl,
      parameters,
    );
  }
}
