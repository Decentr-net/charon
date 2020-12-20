export const ONE_SECOND = 1000;
export const ONE_MINUTE = ONE_SECOND * 60;
export const ONE_HOUR = ONE_MINUTE * 60;

export enum DateAmountType {
  DAYS,
  WEEKS,
  MONTHS,
  YEARS,
}

export const addAmountToDate = (dt: Date, amount: number, dateType: DateAmountType): Date => {
  switch (dateType) {
    case DateAmountType.DAYS:
      return dt.setDate(dt.getDate() + amount) && dt;
    case DateAmountType.WEEKS:
      return dt.setDate(dt.getDate() + (7 * amount)) && dt;
    case DateAmountType.MONTHS:
      return dt.setMonth(dt.getMonth() + amount) && dt;
    case DateAmountType.YEARS:
      return dt.setFullYear(dt.getFullYear() + amount) && dt;
  }
};

export const coerceTimestamp = (input: any): number => {
  const date = isNaN(Date.parse(input)) ? Number(input) : input;

  return Number(new Date(date).valueOf().toString().padEnd(13, '0'));
};
