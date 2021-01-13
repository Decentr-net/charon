export const compareSemver = (a: string, b: string): -1 | 0 | 1 => {
  const aArr = splitVersion(a);
  const bArr = splitVersion(b);

  for (let i = 0; i < 3; i++) {
    const aNumber = aArr[i];
    const bNumber = bArr[i];

    if (aNumber > bNumber || (!isNaN(aNumber) && isNaN(bNumber))) {
      return 1;
    }

    if (aNumber < bNumber || (isNaN(aNumber) && !isNaN(bNumber))) {
      return -1;
    }
  }

  return 0;
};

const splitVersion = (version: string): number[] => {
  return version.split('.').map((num) => +num);
}
