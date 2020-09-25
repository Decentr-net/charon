import { generateMnemonic } from 'decentr-js';
import { sha256 } from 'js-sha256';

export class CryptoService {
  public static encryptPassword(password: string): string {
    return sha256(password);
  }

  public static generateMnemonic(): string {
    return generateMnemonic();
  }
}
