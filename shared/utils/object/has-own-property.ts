export const hasOwnProperty = <T, K extends keyof T>(target: Partial<T>, property: K): boolean => {
  return Object.prototype.hasOwnProperty.call(target, property);
};
