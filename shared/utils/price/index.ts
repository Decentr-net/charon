import { Coin } from 'decentr-js';

import { Denom } from '@shared/pipes/price';

const getFirstEntrance = (value: string, regexp: RegExp): string => {
  return (value.match(regexp) || [])[0] || '';
};

export const findCoinByDenom = (coins: Coin[], denomFilter: Denom): Coin | undefined => {
  return coins.find((coin) => coin?.denom === denomFilter);
};

export const priceFromString = (value: string): Coin[] => {
  const coinsString = value.split(',');

  return coinsString.map((coinString) => ({
    amount: getFirstEntrance(coinString, new RegExp(/^[0-9,.]+/)),
    denom: getFirstEntrance(coinString, new RegExp(/[A-z]+\/\w+|[A-z]+$/)),
  }));
};

export const coerceCoin = (value: string | Coin[]): Coin[] => {
  if (Array.isArray(value)) {
    return value;
  }

  return priceFromString(value);
};
