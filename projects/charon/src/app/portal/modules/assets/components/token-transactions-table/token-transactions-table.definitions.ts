import { TransferHistoryTransaction, TransferRole } from 'decentr-js';

export interface TokenTransaction extends Partial<Omit<TransferHistoryTransaction, 'timestamp'>> {
  role: TransferRole;
  timestamp: number;
}
