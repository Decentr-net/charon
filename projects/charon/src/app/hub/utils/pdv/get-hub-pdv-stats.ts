import { PDVStats } from '@shared/services/pdv';
import { coerceTimestamp } from '@shared/utils/date';
import { getPDVDayChange, mapPDVStatsToChartPoints } from '@shared/utils/pdv';
import { HubPDVStatistics } from '../../components/hub-pdv-statistics';

export const getHubPDVStats = (stats: PDVStats[], pdv: number, fromDate: number): HubPDVStatistics => {
  return {
    fromDate: coerceTimestamp(fromDate),
    pdv,
    pdvChangedIn24HoursPercent: getPDVDayChange(stats, pdv),
    points: mapPDVStatsToChartPoints(stats),
  };
};
