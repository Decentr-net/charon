import { ChartPoint } from '../../components/line-chart';
import { PDVStats } from '../../services/pdv';

export const mapPDVStatsToChartPoints = (stats: PDVStats[]): ChartPoint[] => {
  return (stats || [])
    .map(({ date, value }) => ({
      date: new Date(date).valueOf(),
      value,
    }))
    .sort((left, right) => left.date - right.date);
};
