import { EMPTY, forkJoin, of, switchMap, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { getCerberusClient, getDecentrClient, getTheseusClient } from '../client';
import { environment } from '../../../../../environments/environment';
import { AuthBrowserStorageService } from '../../../../../shared/services/auth';
import { CoinRateFor24Hours, CoinRateHistoryResponse, CurrencyService } from '../../../../../shared/services/currency';
import { DecentrStorage } from '../../../../../shared/services/storage';
import { ONE_SECOND } from '../../../../../shared/utils/date';
import { getPDVDayChange, mapPDVStatsToChartPoints } from '../../../../../shared/utils/pdv';

type StorageValue = {
  stats: {
    currency: {
      history: CoinRateHistoryResponse['prices'];
      rate: CoinRateFor24Hours;
    };
    pdvBalance: {
      history: [number, number][];
      profileCreatedAt: string,
      rate: {
        dayMargin: number;
        value: number;
      };
    };
    pdvRewards: {
      nextDistributionDate: Date;
      reward: number;
    };
  };
};

const authStorage = new AuthBrowserStorageService();
const decentrStorage = new DecentrStorage<StorageValue>();
const currencyService = new CurrencyService(environment);

const clearDecentrStorage = () => decentrStorage.set('stats', {
  currency: undefined,
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
      of(walletAddress),
      getDecentrClient(),
      getCerberusClient(),
      getTheseusClient(),
      of(currencyService),
    ]);
  }),
  switchMap(([walletAddress, decentrClient, cerberusClient, theseusClient, currencyClient]) => forkJoin([
    decentrClient.token.getBalance(walletAddress),
    theseusClient.profile.getProfileStats(walletAddress),
    cerberusClient.profile.getProfile(walletAddress),
    cerberusClient.rewards.getDelta(walletAddress),
    currencyClient.getDecentrCoinRateForUsd24hours(),
    currencyClient.getDecentrCoinRateHistory(30),
  ])),
).subscribe(([pdvBalance, pdvStats, profile, pdvDelta, currencyRate, currencyHistory]) => {
  decentrStorage.set('stats', {
    currency: {
      history: currencyHistory,
      rate: {
        dayMargin: currencyRate.dayMargin,
        value: currencyRate.value,
      },
    },
    pdvBalance: {
      history: mapPDVStatsToChartPoints(pdvStats.stats).map((stat) => [stat.date, stat.value]),
      profileCreatedAt: profile.createdAt,
      rate: {
        dayMargin: getPDVDayChange(pdvStats.stats, +pdvBalance),
        value: +pdvBalance,
      },
    },
    pdvRewards: {
      nextDistributionDate: new Date(pdvDelta.pool.next_distribution_date),
      reward: +pdvDelta.delta
        ? +pdvDelta.pool.size / +pdvDelta.pool.total_delta * +pdvDelta.delta
        : 0,
    },
  });
});
