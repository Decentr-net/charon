import { EMPTY, forkJoin, of, switchMap, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfilePDVStatisticsItem } from 'decentr-js';

import { AuthBrowserStorageService } from '../../../../../shared/services/auth';
import { DecentrStorage } from '../../../../../shared/services/storage';
import { ONE_SECOND } from '../../../../../shared/utils/date';
import { getCerberusClient, getDecentrClient, getTheseusClient } from '../client';

export interface PdvReward {
  nextDistributionDate: Date;
  reward: number;
}

type StorageValue = {
  stats: {
    pdvBalance: {
      profileCreatedAt: string,
      stats: ProfilePDVStatisticsItem[];
      value: number;
    };
    pdvRewards: PdvReward;
  };
};

const authStorage = new AuthBrowserStorageService();
const decentrStorage = new DecentrStorage<StorageValue>();

const clearDecentrStorage = () => decentrStorage.set('stats', {
  pdvBalance: undefined,
  pdvRewards: undefined,
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
      getCerberusClient(),
      getTheseusClient(),
      of(walletAddress),
    ]);
  }),
  switchMap(([decentrClient, cerberusClient, theseusClient, walletAddress]) => forkJoin([
    decentrClient.token.getBalance(walletAddress),
    theseusClient.profile.getProfileStats(walletAddress),
    cerberusClient.profile.getProfile(walletAddress),
    cerberusClient.rewards.getDelta(walletAddress),
  ])),
).subscribe(([pdvBalance, pdvStats, profile, pdvDelta]) => {
  decentrStorage.set('stats', {
    pdvBalance: {
      profileCreatedAt: profile.createdAt,
      stats: pdvStats.stats,
      value: +pdvBalance,
    },
    pdvRewards: {
      nextDistributionDate: new Date(pdvDelta.pool.next_distribution_date),
      reward: +pdvDelta.delta
        ? +pdvDelta.pool.size / +pdvDelta.pool.total_delta * +pdvDelta.delta
        : 0,
    },
  });
});
