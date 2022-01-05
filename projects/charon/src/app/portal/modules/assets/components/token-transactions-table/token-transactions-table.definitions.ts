import { TxMessageTypeUrl, Wallet } from 'decentr-js';

export interface TokenTransactionMessage {
  amount: number | string;
  comment: string;
  fee: number;
  hash: string;
  recipient: Wallet['address'];
  sender: Wallet['address'];
  type: TxMessageTypeUrl;
  timestamp: number;
}

export interface TokenTransaction extends Pick<TokenTransactionMessage, 'amount' | 'comment' | 'fee' | 'hash' | 'timestamp'> {
  messages: Pick<TokenTransactionMessage, 'amount' | 'recipient' | 'sender' | 'type'>[];
}
