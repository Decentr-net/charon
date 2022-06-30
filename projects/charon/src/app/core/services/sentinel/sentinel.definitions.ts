import {
  Coin,
  SentinelNodeStatus as NodeStatus,
} from 'decentr-js';

import { Denom } from '@shared/pipes/price/price.definitions';

export const DEFAULT_DENOM = Denom.IBC_DECENTR;

export interface SentinelNodeStatus extends Omit<NodeStatus, 'price'> {
  countryCode: string;
  price: Coin;
  remoteUrl: string;
  statusAt: Date;
}
