export interface PDVStatChartPoint {
  date: number;
  value: number;
}

export interface BalanceValueDynamic {
  dayMargin: number;
  value: string | number;
}

export interface AdvDdvStatistics {
  adv: number;
  ddv: number;
}

export interface PDVStats {
  date: string;
  value: number;
}

export interface ProfileStats {
  postsCount: number;
  stats: PDVStats[];
}
