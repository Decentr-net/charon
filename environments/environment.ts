// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.definitions';

export const environment: Environment = {
  awsStorage: 'https://tf-decentr-public-testnet.s3.us-east-2.amazonaws.com',
  cerberusUrl: 'https://cerberus.testnet.decentr.xyz',
  chainId: 'testnet2',
  currencyApi: 'https://api.coingecko.com/api/v3',
  image: {
    api: 'https://api.imgbb.com/1/upload',
    apiKey: '4fbcace4986794505b9df6421d21228c',
  },
  production: false,
  rest: {
    local: 'http://localhost:1317',
  },
  vulcanApi: 'https://vulcan.testnet.decentr.xyz/v1',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
