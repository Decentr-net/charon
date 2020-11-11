const toLowerCaseIfNeeded = (value: string, need: boolean) => need ? value.toLocaleLowerCase() : value;

const compareStrings = (left: string, right: string, caseSensitive: boolean = false) => {
  return toLowerCaseIfNeeded(left, !caseSensitive) === toLowerCaseIfNeeded(right, !caseSensitive);
};

export const objectContains = (
  obj: {} | string | number,
  searchValues: string[],
  caseSensitive: boolean = false
) => {
  if (typeof obj === 'string' || typeof obj === 'number') {
    return searchValues.find((searchValue) => compareStrings(searchValue, obj.toString(), caseSensitive));
  }

  return Object.values(obj).some(objKeyValue => {
    if (Array.isArray(objKeyValue)) {
      return objKeyValue.some((arrayValue) => objectContains(arrayValue, searchValues, caseSensitive));
    }

    return objectContains(objKeyValue, searchValues, caseSensitive);
  });
}
