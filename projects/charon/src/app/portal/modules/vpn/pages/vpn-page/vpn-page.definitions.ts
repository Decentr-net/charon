import { SentinelSession, SentinelSubscription } from 'decentr-js';

import { SentinelNodeStatus } from '@core/services';

export interface SentinelExtendedSubscription extends SentinelSubscription {
  sessions: SentinelSession[];
}

export interface SentinelNodeExtendedDetails extends SentinelNodeStatus {
  sessions: SentinelSession[];
  subscriptions: SentinelExtendedSubscription[];
}
