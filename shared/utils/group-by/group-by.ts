export type GroupedBy<T, K extends keyof T> = {
  items: T[];
  key: T[K];
}[];

export const groupBy = <T, K extends keyof T>(items: T[], key: K): GroupedBy<T, K> => {
  const groupMap = items.reduce((map, item) => {
    const keyValue = item[key];
    const itemsGroup = map.get(keyValue);
    return map.set(keyValue, [...itemsGroup ? itemsGroup : [], item]);
  }, new Map());

  const group = [];
  groupMap.forEach((groupItems, groupKey) => group.push({ items: groupItems, key: groupKey }));

  return group;
};
