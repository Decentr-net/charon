import { defer, forkJoin, Observable, of, switchMap, timer } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { getCerberusClient, getDecentrClient, getTheseusClient } from '../client';
import { environment } from '../../../../../environments/environment';
import { AuthBrowserStorageService } from '../../../../../shared/services/auth';
import { CoinRateFor24Hours, CoinRateHistoryResponse, CurrencyService } from '../../../../../shared/services/currency';
import { DecentrStorage } from '../../../../../shared/services/storage';
import { ONE_SECOND } from '../../../../../shared/utils/date';
import { getPDVDayChange, mapPDVStatsToChartPoints } from '../../../../../shared/utils/pdv';
import { CerberusClient, DecentrClient, TheseusClient } from 'decentr-js';

interface CurrencyStats {
  history: CoinRateHistoryResponse['prices'];
  rate: CoinRateFor24Hours;
}

interface PdvBalanceStats {
  history: [number, number][];
  profileCreatedAt: string;
  rate: {
    dayMargin: number;
    value: number;
  };
}

interface PdvRewardsStats {
  nextDistributionDate: Date;
  reward: number;
}

type StorageValue = {
  stats: {
    currency: CurrencyStats;
    pdvBalance: PdvBalanceStats;
    pdvRewards: PdvRewardsStats;
  };
};

const authStorage = new AuthBrowserStorageService();
const decentrStorage = new DecentrStorage<StorageValue>();
const currencyService = new CurrencyService(environment);

const getCurrency = (): Observable<CurrencyStats> => {
  return forkJoin([
    currencyService.getDecentrCoinRateForUsd24hours(),
    currencyService.getDecentrCoinRateHistory(30),
  ]).pipe(
    map(([currencyRate, currencyHistory]) => ({
      history: currencyHistory,
      rate: {
        dayMargin: currencyRate.dayMargin,
        value: currencyRate.value,
      },
    })),
    catchError(() => of(undefined)),
  );
};

const getPdvRewards = (cerberusClient: CerberusClient, walletAddress: string): Observable<PdvRewardsStats> => {
  return defer(() => cerberusClient.rewards.getDelta(walletAddress)).pipe(
    map((pdvDelta) => ({
      nextDistributionDate: new Date(pdvDelta.pool.next_distribution_date),
      reward: +pdvDelta.delta
        ? +pdvDelta.pool.size / +pdvDelta.pool.total_delta * +pdvDelta.delta
        : 0,
    })),
    catchError(() => of(undefined)),
  );
};

const getPdvBalance = (
  decentrClient: DecentrClient,
  theseusClient: TheseusClient,
  cerberusClient: CerberusClient,
  walletAddress: string,
): Observable<PdvBalanceStats> => {
  return forkJoin([
    decentrClient.token.getBalance(walletAddress),
    theseusClient.profile.getProfileStats(walletAddress),
    cerberusClient.profile.getProfile(walletAddress),
  ]).pipe(
    map(([pdvBalance, pdvStats, profile]) => ({
      history: mapPDVStatsToChartPoints(pdvStats.stats).map((stat) => [stat.date, stat.value] as [number, number]),
      profileCreatedAt: profile.createdAt,
      rate: {
        dayMargin: getPDVDayChange(pdvStats.stats, +pdvBalance),
        value: +pdvBalance,
      },
    })),
    catchError(() => of(undefined)),
  );
};

export const initDecentrStorageStatsSync = () => authStorage.getActiveUser().pipe(
  switchMap((user) => timer(0, ONE_SECOND * 30).pipe(
    map(() => user?.wallet?.address),
  )),
  switchMap((walletAddress) => {
    if (!walletAddress) {
      return of({
        currency: undefined,
        pdvBalance: undefined,
        pdvRewards: undefined,
      });
    }

    return forkJoin([
      getDecentrClient(),
      getCerberusClient(),
      getTheseusClient(),
    ]).pipe(
      switchMap(([decentrClient, cerberusClient, theseusClient]) => forkJoin({
        currency: getCurrency(),
        pdvBalance: getPdvBalance(decentrClient, theseusClient, cerberusClient, walletAddress),
        pdvRewards: getPdvRewards(cerberusClient, walletAddress),
      })),
    );
  }),
).subscribe((stats) => {
  decentrStorage.set('stats', stats);
});
