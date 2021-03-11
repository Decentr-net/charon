const valueIsEmpty = (value: any): boolean => {
  return typeof value === 'undefined'
    || value === null
    || (value as string) === ''
    || typeof value === 'object' && !Object.keys(value).length
}

export const removeEmptyValues = <T extends object>(target: T): T => {
  if (typeof target !== 'object') {
    return target;
  }

  const result: T = {} as T;

  Object.keys(target)
    .filter((key) => !valueIsEmpty(target[key]))
    .forEach((key) => {
      result[key] = target[key];
    });

  return result;
}
