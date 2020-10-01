import { Injectable } from '@angular/core';
import { getNewWalletFromSeed } from 'decentr-js';

import { Environment } from '@environments/environment.definitions';

export interface Wallet {
  walletAddress: string;
  privateKey: string;
  publicKey: string;
}

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(private environment: Environment) {
  }

  public getNewWallet(seedPhrase: string): Wallet {
    const {
      cosmosAddress: walletAddress,
      ...rest
    } = getNewWalletFromSeed(seedPhrase, this.environment.walletPrefix);

    return {
      ...rest,
      walletAddress,
    };
  }
}
