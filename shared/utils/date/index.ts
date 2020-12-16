export const unixToJsTimestamp = (unixTime: string | number): number => {
  return Number(unixTime.toString().padEnd(13, '0'))
};
