import { TxMessageTypeUrl, Wallet } from 'decentr-js';

export interface TokenTransactionMessage {
  readonly type: TxMessageTypeUrl;
  readonly amount: number;
  readonly recipient: Wallet['address'];
  readonly sender: Wallet['address'];
}

export class TokenSingleTransaction implements TokenTransactionMessage {
  constructor(
    public readonly type: TxMessageTypeUrl,
    public readonly hash: string,
    public readonly height: number,
    public readonly fee: number,
    public readonly amount: number,
    public readonly recipient: Wallet['address'],
    public readonly sender: Wallet['address'],
    public readonly comment?: string,
  ) {
  }
}
