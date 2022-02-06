import { combineLatest, firstValueFrom, Observable, of, switchMap } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { DecentrClient, Wallet } from 'decentr-js';

import { AuthBrowserStorageService } from '../../../../../../../shared/services/auth';
import { LockBrowserStorageService } from '../../../../../../../shared/services/lock';
import { NetworkBrowserStorageService } from '../../../../../../../shared/services/network-storage';
import { SettingsService } from '../../../../../../../shared/services/settings';
import { MessageBus } from '../../../../../../../shared/message-bus';
import { WebpageAPIMessageBusMap, WebpageAPIMessageCode } from '../../../../background/webpage-api';

const messageBus = new MessageBus<WebpageAPIMessageBusMap>();

const authBrowserStorageService = new AuthBrowserStorageService();
const networkBrowserStorageService = new NetworkBrowserStorageService();
const lockBrowserStorageService = new LockBrowserStorageService();
const settingsService = new SettingsService();

const getDecentrClient = (): Observable<DecentrClient> => {
  return networkBrowserStorageService.getActiveAPI().pipe(
    switchMap((api) => DecentrClient.create(api)),
  );
}

const getWallet = (): Observable<Wallet> => {
  return authBrowserStorageService.getActiveUser().pipe(
    map((user) => user?.wallet),
    distinctUntilChanged((prev, curr) => prev?.address === curr?.address),
  );
};

export const getWalletAddress = (): Observable<Wallet['address']> => {
  return getWallet().pipe(
    map((wallet) => wallet?.address),
  );
};

export const getBalance = (): Observable<string> => {
  return combineLatest([
    getWalletAddress(),
    getDecentrClient(),
  ]).pipe(
    switchMap(([walletAddress, decentrClient]) => {
      return walletAddress
        ? decentrClient.bank.getDenomBalance(walletAddress)
          .then((coin) => coin.amount)
        : of('0');
    }),
  );
};

export const isConnected = (): Observable<boolean> => {
  return getWalletAddress().pipe(
    switchMap((walletAddress) => {
      if (!walletAddress) {
        return of(false);
      }

      return combineLatest([
        lockBrowserStorageService.getLockedChanges(),
        settingsService.getUserSettingsService(walletAddress).pdv.getCollectionConfirmed(),
      ]).pipe(
        map(([isLocked, pdvCollectionConfirmed]) => !isLocked && pdvCollectionConfirmed),
      );
    }),
  );
};

export const connect = async (): Promise<void> => {
  const connected = await firstValueFrom(isConnected());

  if (connected) {
    return;
  }

  const locked = await lockBrowserStorageService.getLocked();

  if (locked) {
    return messageBus.sendMessage(WebpageAPIMessageCode.Unlock);
  }

  return messageBus.sendMessage(WebpageAPIMessageCode.OpenExtension);
};
