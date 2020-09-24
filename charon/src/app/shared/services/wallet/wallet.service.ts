import { getNewWalletFromSeed } from 'decentr-js';
import { environment } from '../../../../environments/environment';

export interface WalletKeyPair {
  privateKey: string;
  publicKey: string;
}

export class WalletService {
  public static getNewWallet(seedPhrase: string): WalletKeyPair {
    return getNewWalletFromSeed(seedPhrase, environment.walletPrefix);
  }
}
