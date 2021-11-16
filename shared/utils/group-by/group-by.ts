export type GroupedBy<T, K extends keyof T = keyof T> = {
  items: T[];
  key: K;
}[];

export const groupBy = <T>(items: T[], key: keyof T): GroupedBy<T> => {
  const groupMap = items.reduce((map, item) => {
    const keyValue = item[key];
    const itemsGroup = map.get(keyValue);
    return map.set(keyValue, [...itemsGroup ? itemsGroup : [], item]);
  }, new Map());

  const group = [];
  groupMap.forEach((groupItems, key) => group.push({ items: groupItems, key }));

  return group;
};
