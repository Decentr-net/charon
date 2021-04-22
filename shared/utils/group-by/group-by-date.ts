export type GroupedByDate<T> = {
  items: T[];
  timestamp: number;
}[];

export const groupByDate = <T>(items: T[], dateGetter: (item: T) => Date | number | string): GroupedByDate<T> => {
  const groupMap = items.reduce((groupMap, item) => {
    const timestamp = new Date(dateGetter(item)).setHours(0, 0, 0, 0);
    const group = groupMap.get(timestamp);
    return groupMap.set(timestamp, [...group ? group : [], item]);
  }, new Map());

  const group = [];
  groupMap.forEach((items, timestamp) => group.push({ items, timestamp }));

  return group;
}
