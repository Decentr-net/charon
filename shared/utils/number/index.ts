export const exponentialToFixed = (value: number | string): string => {
  const numStr = value.toString();
  const num = +value;

  if (!numStr.includes('e')) {
    return num.toString();
  }

  const degree = +numStr.split('-').slice(-1)[0];
  return num.toFixed(degree);
};

export const calculateDifferencePercentage = (firstNumber: number, secondNumber: number): number => {
  return secondNumber ? (firstNumber / secondNumber * 100) - 100 : 0;
};
