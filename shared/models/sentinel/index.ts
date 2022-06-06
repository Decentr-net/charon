import { Coin, SentinelNodeStatus as NodeStatus, SentinelSubscription } from 'decentr-js';

import { Denom } from '../../pipes/price/price.definitions';

export const DEFAULT_DENOM = Denom.IBC_UDEC;

export interface SentinelNodeStatus extends Omit<NodeStatus, 'price'> {
  price: Coin;
}

export interface SentinelNodeStatusWithSubscriptions extends SentinelNodeStatus {
  subscriptions: SentinelSubscription[];
}
