import { Injectable } from '@angular/core';
import {
  getBankBalances,
  getTransferHistory,
  BankCoin,
  TransferHistory,
  TransferHistoryPaginationOptions,
  TransferRole,
  Wallet,
} from 'decentr-js';

@Injectable()
export class BankApiService {
  public getCoinBalance(apiUrl: string, walletAddress: Wallet['address']): Promise<BankCoin[]> {
    return getBankBalances(apiUrl, walletAddress);
  }

  public getTransferHistory(
    apiUrl: string,
    walletAddress: Wallet['address'],
    role: TransferRole,
    paginationOptions?: TransferHistoryPaginationOptions,
  ): Promise<TransferHistory> {
    return getTransferHistory(
      apiUrl,
      walletAddress,
      role,
      paginationOptions,
    );
  }
}
