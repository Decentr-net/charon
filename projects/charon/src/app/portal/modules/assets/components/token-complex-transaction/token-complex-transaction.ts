import { TokenTransactionMessage } from '../token-single-transaction';

export class TokenComplexTransaction {
  constructor(
    public readonly hash: string,
    public readonly height: number,
    public readonly fee: number,
    public readonly amount: number,
    public readonly messages: TokenTransactionMessage[],
    public readonly comment?: string,
  ) {
  }
}
