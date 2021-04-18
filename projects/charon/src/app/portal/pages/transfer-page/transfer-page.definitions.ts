import { Wallet } from 'decentr-js';

export const RECEIVER_WALLET_PARAM = 'to';

export interface TransferForm {
  amount: number;
  [RECEIVER_WALLET_PARAM]: Wallet['address'];
}

export const TRANSFER_START_AMOUNT = 0.000001;
