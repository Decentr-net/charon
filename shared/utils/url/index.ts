export const URL_EXP = /^(https?:\/\/)?([\da-zа-я.-]+\.[a-zа-я.]{2,6}|[\d.]+)([\/:?=&#]{1}[\da-zа-я.-]+)*[\/?]?$/gi;

export const addHttpsToUrl = (url: string): string => {
  if (!/^(?:f|ht)tps?:\/\//.test(url)) {
    return `https://${ url }`;
  }

  return url;
};
