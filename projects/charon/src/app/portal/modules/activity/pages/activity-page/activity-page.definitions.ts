import { Observable } from 'rxjs';
import { PDV, PDVType } from 'decentr-js';

export const ACTIVITY_DATE_FORMAT = 'dd/MM/yyyy HH:mm';

export interface ActivityListItemPDV {
  title: string;
  details: PDV;
}

export interface ActivityListItemPDVBlock {
  type: PDVType;
  title: string;
  pdv: ActivityListItemPDV[];
}

export interface ActivityListItem {
  unixTimestamp: number;
  timestamp: number;
  pdvBlocks: Observable<ActivityListItemPDVBlock[]>;
}
