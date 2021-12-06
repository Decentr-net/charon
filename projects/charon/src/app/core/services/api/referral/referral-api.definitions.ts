export interface ReferralStats {
  registered: number;
  installed: number;
  confirmed: number;
  reward: number;
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
  thresholdUpdv: number;
  thresholdDays: number;
}
