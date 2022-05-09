export type GroupedByKey<T, K extends keyof T> = {
  items: T[];
  key: T[K];
}[];

export type GroupedByKeyFn<T> = {
  items: T[];
  key: string;
}[];

export type GroupedBy<T, K extends keyof T> = GroupedByKey<T, K> | GroupedByKeyFn<T>;

export function groupBy<T>(items: T[], key: (item: T) => string): GroupedByKeyFn<T>;
export function groupBy<T, K extends keyof T>(items: T[], key: K): GroupedByKey<T, K>;
export function groupBy<T, K extends keyof T>(items: T[], key: K | ((item: T) => string)): GroupedBy<T, K> {
  const groupMap = items.reduce((map, item) => {
    const keyValue = typeof key === 'function' ?  key(item) : item[key];
    const itemsGroup = map.get(keyValue);
    return map.set(keyValue, [...itemsGroup ? itemsGroup : [], item]);
  }, new Map());

  const group = [];
  groupMap.forEach((groupItems, groupKey) => group.push({ items: groupItems, key: groupKey }));

  return group;
}
