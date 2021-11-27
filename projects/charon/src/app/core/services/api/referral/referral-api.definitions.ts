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

export interface ReferralConfig {
  senderReward: number;
  receiverReward: number;
  thresholdUpdv: number;
  thresholdDays: number;
}
