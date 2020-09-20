import { Mnemonic } from 'decentr-js';

export class CryptoService {
  public static encryptPassword(password: string): string {
    return password;
  }

  public static generateMnemonic(): string {
    return new Mnemonic().generate()
  }

  public static generatePrivateKey(mnemonic: string): string {
    return mnemonic;
  }
}
