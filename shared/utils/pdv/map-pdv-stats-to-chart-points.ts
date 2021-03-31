import { PDVStatItem } from 'decentr-js';

import { ChartPoint } from '../../components/line-chart';

export const mapPDVStatsToChartPoints = (stats: PDVStatItem[]): ChartPoint[] => {
  return (stats || [])
    .map(({ date, value }) => ({
      date: new Date(date).valueOf(),
      value,
    }))
    .sort((left, right) => left.date - right.date);
};
