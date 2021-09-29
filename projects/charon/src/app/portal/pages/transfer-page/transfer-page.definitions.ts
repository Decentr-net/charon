import { Wallet } from 'decentr-js';

export const RECEIVER_WALLET_PARAM = 'to';

export interface TransferFormData {
  amount: number;
  [RECEIVER_WALLET_PARAM]: Wallet['address'];
}

export interface TransferForm {
  data: TransferFormData;
  comment: string;
}

export const TRANSFER_START_AMOUNT = 0.000001;
