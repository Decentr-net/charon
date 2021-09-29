import { Observable } from 'rxjs';
import { TokenTransaction } from '../../components/token-transactions-table';

export interface Asset {
  balance: string;
  transactions: Observable<TokenTransaction[][]>;
}
