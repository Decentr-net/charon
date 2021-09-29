export const parseDateValue = (value: string): { year: number, month: number, day: number } => {
  const values = value.split('-');
  const year = +values[0];
  const month = +values[1] - 1;
  const day = +values[2];

  return {
    year,
    month,
    day,
  };
};
