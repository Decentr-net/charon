import { Observable } from 'rxjs';
import { TokenTransaction } from '../../components/token-transactions-table';

export interface Asset {
  balance: string;
  token: string;
  transactions: Observable<TokenTransaction[][]>;
}
