import { EMPTY, forkJoin, of, switchMap, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthBrowserStorageService } from '../../../../../shared/services/auth';
import { DecentrStorage } from '../../../../../shared/services/storage';
import { ONE_SECOND } from '../../../../../shared/utils/date';
import { getDecentrClient } from '../client';

// interface ParamStatsValue {
//   date: number;
//   value: number;
// }

type StorageValue = {
  stats: {
    pdvBalance: {
      value: number;
      // stats: ParamStatsValue[];
    };
    decBalance: {
      value: number;
    };
    // coin: {
    //   value: number;
    //   stats: ParamStatsValue[];
    // };
  };
};

const authStorage = new AuthBrowserStorageService();
const decentrStorage = new DecentrStorage<StorageValue>();

const clearDecentrStorage = () => decentrStorage.set('stats', {
  pdvBalance: undefined,
  decBalance: undefined,
  // coin: undefined,
});

export const initDecentrStorageStatsSync = () => authStorage.getActiveUser().pipe(
  switchMap((user) => timer(0, ONE_SECOND * 30).pipe(
    map(() => user?.wallet?.address),
  )),
  switchMap((walletAddress) => {
    if (!walletAddress) {
      clearDecentrStorage();
      return EMPTY;
    }

    return forkJoin([
      getDecentrClient(),
      of(walletAddress),
    ]);
  }),
  switchMap(([decentrClient, walletAddress]) => forkJoin([
    decentrClient.bank.getDenomBalance(walletAddress),
    decentrClient.token.getBalance(walletAddress),
    
  ])),
).subscribe(([decBalance, pdvBalance]) => {
  decentrStorage.set('stats', {
    decBalance: {
      value: +decBalance.amount,
    },
    pdvBalance: {
      value: +pdvBalance,
    },
  });
});
