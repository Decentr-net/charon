import { Observable } from 'rxjs';
import { PDV } from 'decentr-js';

export interface ActivityListItem {
  timestamp: number;
  pdvList: Observable<PDV[]>;
}
