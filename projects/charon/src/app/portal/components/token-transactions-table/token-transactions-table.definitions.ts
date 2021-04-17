import { TransferHistoryTransaction, TransferRole } from 'decentr-js';

export interface TokenTransaction extends TransferHistoryTransaction {
  role: TransferRole;
}
