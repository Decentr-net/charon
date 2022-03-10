import { Observable } from 'rxjs';

import { TokenTransaction } from '../../components';

export interface Asset {
  balance: string;
  transactions: Observable<TokenTransaction[][]>;
}
