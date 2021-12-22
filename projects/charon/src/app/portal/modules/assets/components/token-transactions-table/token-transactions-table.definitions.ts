import { Coin, Wallet } from 'decentr-js';

export enum TokenTransactionMessageType {
  TransferSent,
  TransferReceived,
  WithdrawRewards,
  PdvRewards,
  WithdrawDelegate,
  WithdrawUndelegate,
  WithdrawRedelegate,
  WithdrawValidatorRewards,
}

export interface TokenTransactionMessage {
  amount: Coin;
  comment: string;
  fee: any;
  hash: string;
  recipient: Wallet['address'];
  sender: Wallet['address'];
  type: TokenTransactionMessageType;
  timestamp: number;
}

export interface TokenTransaction extends Pick<TokenTransactionMessage, 'amount' | 'comment' | 'fee' | 'hash' | 'timestamp'> {
  messages: Pick<TokenTransactionMessage, 'amount' | 'recipient' | 'sender' | 'type'>[];
}
