import { Coin } from 'decentr-js';

export interface ReferralStats {
  registered: number;
  installed: number;
  confirmed: number;
  reward: Coin;
}

export interface ReferralTimeStats {
  total: ReferralStats;
  last30Days: ReferralStats;
}

export interface ReferralSenderBonus {
  count: number;
  reward: number;
}

export interface SenderRewardLevel {
  from: number;
  to: number;
  reward: number;
}

export interface ReferralConfig {
  senderBonus: ReferralSenderBonus[];
  senderRewardLevels: SenderRewardLevel[];
  thresholdPDV: string;
  thresholdDays: number;
}
