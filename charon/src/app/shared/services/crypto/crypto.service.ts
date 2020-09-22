import { generateMnemonic } from 'decentr-js';

export class CryptoService {
  public static encryptPassword(password: string): string {
    return password;
  }

  public static generateMnemonic(): string {
    return generateMnemonic();
  }
}
