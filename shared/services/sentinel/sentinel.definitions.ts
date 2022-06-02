import { Coin, SentinelNodeStatus as NodeStatus, SentinelSubscription } from 'decentr-js';

export interface SentinelNodeStatus extends Omit<NodeStatus, 'price'> {
  price: Coin;
  subscriptions?: SentinelSubscription[];
}
