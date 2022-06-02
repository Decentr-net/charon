import { Coin } from 'decentr-js';

const getFirstEntrance = (value: string, regexp: RegExp): string => {
  return (value.match(regexp) || [])[0] || '';
};

export const priceFromString = (value: string): Coin => {
  return {
    amount: getFirstEntrance(value, new RegExp(/^[0-9,.]+/)),
    denom: getFirstEntrance(value, new RegExp(/[A-z]+\/\w+|[A-z]+$/)),
  };
};
