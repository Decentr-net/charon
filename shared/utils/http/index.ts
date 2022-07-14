export const httpUrl = (httpsUrl: string): string => {
  return httpsUrl.replace('https://', 'http://');
};
