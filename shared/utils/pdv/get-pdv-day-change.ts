import { calculateDifferencePercentage } from '../number';

export const getPDVDayChange = (stats: ({ date: number | string; value: number })[], currentPDV: number): number => {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  const previousPDV = (stats || [])
    .map((stat) => ({ ...stat, date: new Date(stat.date).valueOf() }))
    .sort((left, right) => right.date - left.date)
    .find((stat) => stat.date !== today)?.value;

  return calculateDifferencePercentage(currentPDV, previousPDV);
};
