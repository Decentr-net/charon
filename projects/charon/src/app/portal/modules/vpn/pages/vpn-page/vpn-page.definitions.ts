import { Observable } from 'rxjs';
import { SentinelNode, SentinelSession, SentinelSubscription } from 'decentr-js';

import { SentinelNodeStatus } from '@core/services';

export interface SentinelExtendedSubscription extends SentinelSubscription {
  sessions: SentinelSession[];
}

export interface SentinelNodeExtendedDetails extends SentinelNode {
  sessions: SentinelSession[];
  subscriptions: SentinelExtendedSubscription[];
  status$: Observable<SentinelNodeStatus>;
}
