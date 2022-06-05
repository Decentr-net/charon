import { Coin, SentinelNodeStatus as NodeStatus, SentinelSubscription } from 'decentr-js';

import { Denom } from '@shared/pipes/price';

export const DEFAULT_DENOM = Denom.IBC_UDEC;

export interface SentinelNodeStatus extends Omit<NodeStatus, 'price'> {
  price: Coin;
}

export interface SentinelNodeStatusWithSubscriptions extends SentinelNodeStatus {
  subscriptions: SentinelSubscription[];
}
