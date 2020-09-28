import { getNewWalletFromSeed } from 'decentr-js';

import { environment } from '../../../../environments/environment';

export interface Wallet {
  walletAddress: string;
  privateKey: string;
  publicKey: string;
}

export class WalletService {
  public static getNewWallet(seedPhrase: string): Wallet {
    const {
      cosmosAddress: walletAddress,
      ...rest
    } = getNewWalletFromSeed(seedPhrase, environment.walletPrefix);

    return {
      ...rest,
      walletAddress,
    };
  }
}
