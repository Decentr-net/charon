import { Environment } from './environment.definitions';

export const environment: Environment = {
  chainId: 'mainnet',
  currencyApi: 'https://api.coingecko.com/api/v3',
  image: {
    api: 'https://api.imgbb.com/1/upload',
    apiKey: '',
  },
  production: true,
  rest: {
    local: 'http://localhost:1317',
    remote: 'https://rest.testnet.decentr.xyz',
  },
  vulcanApi: 'https://vulcan.testnet.decentr.xyz/v1',
};
