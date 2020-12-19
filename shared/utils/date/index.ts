export const ONE_SECOND = 1000;
export const ONE_MINUTE = ONE_SECOND * 60;
export const ONE_HOUR = ONE_MINUTE * 60;

export const coerceTimestamp = (input: any): number => {
  const date = isNaN(Date.parse(input)) ? Number(input) : input;

  return Number(new Date(date).valueOf().toString().padEnd(13, '0'));
};
