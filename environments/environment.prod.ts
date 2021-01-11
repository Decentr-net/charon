import { Environment } from './environment.definitions';

export const environment: Environment = {
  awsStorage: 'https://tf-decentr-public-testnet.s3.us-east-2.amazonaws.com',
  chainId: 'testnet',
  currencyApi: 'https://api.coingecko.com/api/v3',
  image: {
    api: 'https://api.imgbb.com/1/upload',
    apiKey: '4fbcace4986794505b9df6421d21228c',
  },
  production: true,
  rest: {
    local: 'http://localhost:1317',
  },
  vulcanApi: 'https://vulcan.testnet.decentr.xyz/v1',
};
