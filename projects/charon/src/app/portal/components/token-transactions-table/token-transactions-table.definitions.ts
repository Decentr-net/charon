import { TransferHistoryTransaction, TransferRole } from 'decentr-js';

export interface TokenTransaction extends Omit<TransferHistoryTransaction, 'timestamp'> {
  role: TransferRole;
  timestamp: number;
}
