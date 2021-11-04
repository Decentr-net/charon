import { BankCoin, StdTxFee, Wallet } from 'decentr-js';

export enum TokenTransactionType {
  TransferSent,
  TransferReceived,
  WithdrawRewards,
  PdvRewards,
}

export interface TokenTransaction {
  amount: BankCoin;
  comment: string;
  fee: StdTxFee;
  hash: string;
  recipient: Wallet['address'];
  sender: Wallet['address'];
  type: TokenTransactionType;
  timestamp: number;
}
