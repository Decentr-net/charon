export const compareSemver = (a: string, b: string): -1 | 0 | 1 => {
  const aArr = a.split('.');
  const bArr = b.split('.');

  for (let i = 0; i < 3; i++) {
    const aNumber = Number(aArr[i]);
    const bNumber = Number(bArr[i]);

    if (aNumber > bNumber || (!isNaN(aNumber) && isNaN(bNumber))) {
      return 1;
    }

    if (aNumber < bNumber || (isNaN(aNumber) && !isNaN(bNumber))) {
      return -1;
    }
  }

  return 0;
};
