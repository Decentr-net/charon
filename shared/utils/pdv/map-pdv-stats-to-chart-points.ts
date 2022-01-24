import { ProfilePDVStatisticsItem } from 'decentr-js';

import { ChartPoint } from '../../components/line-chart';

export const mapPDVStatsToChartPoints = (stats: ProfilePDVStatisticsItem[]): ChartPoint[] => {
  return (stats || [])
    .map(({ date, value }) => ({
      date: new Date(date).valueOf(),
      value,
    }))
    .sort((left, right) => left.date - right.date);
};
