export const exponentialToFixed = (value: number | string): string => {
  const numStr = value.toString();
  const num = +value;

  if (!numStr.includes('e')) {
    return num.toString();
  }

  const degree = +numStr.split('-')[1];
  return num.toFixed(degree);
}
