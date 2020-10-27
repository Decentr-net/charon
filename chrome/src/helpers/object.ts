export const objectContains = (obj: {}, searchValues: string[]) => {
  return Object.values(obj).some(val => {
    if (Array.isArray(val)) {
      return val.some((val) => searchValues.includes(val));
    }

    if (typeof val === 'object') {
      return objectContains(val, searchValues);
    }

    return searchValues.includes(val.toString());
  });
}
