export const coerceTimestamp = (input: any): number => {
  const date = isNaN(Date.parse(input)) ? Number(input) : input;

  return Number(new Date(date).valueOf().toString().padEnd(13, '0'));
};
