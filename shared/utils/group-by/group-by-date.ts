export type GroupedByDate<T> = {
  items: T[];
  timestamp: number;
}[];

export const groupByDate = <T>(items: T[], dateGetter: (item: T) => Date | number | string): GroupedByDate<T> => {
  const groupMap = items.reduce((map, item) => {
    const timestamp = new Date(dateGetter(item)).setHours(0, 0, 0, 0);
    const itemsGroup = map.get(timestamp);
    return map.set(timestamp, [...itemsGroup ? itemsGroup : [], item]);
  }, new Map());

  const group = [];
  groupMap.forEach((groupItems, timestamp) => group.push({ items: groupItems, timestamp }));

  return group;
};
