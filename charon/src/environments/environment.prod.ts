import { Environment } from './environment.definitions';

export const environment: Environment = {
  chainId: 'mainnet',
  currencyApi: 'https://api.coingecko.com/api/v3',
  production: true,
  rest: {
    local: 'http://localhost:1317',
    remote: 'https://rest.testnet.decentr.xyz',
  },
  vulcanApi: 'https://vulcan.testnet.decentr.xyz/v1',
  walletPrefix: 'decentr',
};
