export const parseDateValue = (value: string): { year: number, month: number, day: number } => {
  return {
    year: parseInt(value.slice(0, 4)),
    month: parseInt(value.slice(5, 7)) - 1,
    day: parseInt(value.slice(8, 10)),
  };
};
