import { ProfilePDVStatisticsItem } from 'decentr-js';

import { coerceTimestamp } from '@shared/utils/date';
import { getPDVDayChange, mapPDVStatsToChartPoints } from '@shared/utils/pdv';
import { HubPDVStatistics } from '../../components/hub-pdv-statistics';

export const getHubPDVStats = (stats: ProfilePDVStatisticsItem[], pdv: number, fromDate: number): HubPDVStatistics => {
  return {
    fromDate: coerceTimestamp(fromDate),
    pdv,
    pdvChangedIn24HoursPercent: getPDVDayChange(stats, pdv),
    points: mapPDVStatsToChartPoints(stats),
  };
};
