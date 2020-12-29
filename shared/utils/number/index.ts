export const exponentialToFixed = (value: number | string): string => {
  const numStr = value.toString();
  const num = +value;

  if (!numStr.includes('e')) {
    return num.toString();
  }

  const degree = +numStr.split('-').slice(-1)[0];
  return num.toFixed(degree);
};

export const calculateDifferencePercentage = (newNumber: number, oldNumber: number): number => {
  return oldNumber ? (newNumber - oldNumber) / Math.abs(oldNumber) * 100 : 0;
};
