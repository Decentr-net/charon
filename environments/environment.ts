// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.definitions';

export const environment: Environment = {
  avatars: 'https://public.decentr.xyz/avatars',
  config: 'https://public.decentr.xyz/config.json',
  currencyApi: 'https://api.coingecko.com/api/v3',
  explorer: 'https://explorer.decentr.net',
  ga: 'UA-144841582-4',
  help: 'dc44855d-b3e4-48b7-9f92-31ed086a56a5',
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
