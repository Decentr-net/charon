import { Observable } from 'rxjs';

import { TokenTransactionMessage } from '../../components/token-transactions-table';

export interface Asset {
  balance: string;
  transactions: Observable<TokenTransactionMessage[][]>;
}
