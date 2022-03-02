import { combineLatest, firstValueFrom, Observable, of, switchMap } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { DecentrClient, Wallet } from 'decentr-js';

import { AuthBrowserStorageService } from '../../../../../../../shared/services/auth';
import { LockBrowserStorageService } from '../../../../../../../shared/services/lock';
import { ConfigService } from '../../../../../../../shared/services/configuration';
import { NetworkBrowserStorageService } from '../../../../../../../shared/services/network-storage';
import { SettingsService } from '../../../../../../../shared/services/settings';
import { MessageBus } from '../../../../../../../shared/message-bus';
import { WebpageAPIMessageBusMap, WebpageAPIMessageCode } from '../../../../background/webpage-api';
import { environment } from '../../../../../../../environments/environment';
import { WebpageAPIResponseMessageCode, WebpageAPIResponseMessageMap } from '../../webpage-api-message-bus';

const messageBus = new MessageBus<WebpageAPIMessageBusMap>();

const authBrowserStorageService = new AuthBrowserStorageService();
const networkBrowserStorageService = new NetworkBrowserStorageService();
const configService = new ConfigService(environment, networkBrowserStorageService);
const lockBrowserStorageService = new LockBrowserStorageService();
const settingsService = new SettingsService();

const getDecentrClient = (): Observable<DecentrClient> => {
  return networkBrowserStorageService.getActiveAPI().pipe(
    switchMap((api) => DecentrClient.create(api)),
  );
};

export const getNetwork = (): Observable<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetNetwork]> => {
  return networkBrowserStorageService.getActiveId();
};

export const getMaintenance = (): Observable<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetMaintenance]> => {
  return networkBrowserStorageService.getActiveId().pipe(
    filter(Boolean),
    switchMap(() => configService.getMaintenanceStatus()),
  );
};

export const getWallet = (): Observable<Wallet> => {
  return authBrowserStorageService.getActiveUser().pipe(
    map((user) => user?.wallet),
    distinctUntilChanged((prev, curr) => prev?.address === curr?.address),
  );
};

export const getWalletAddress = (): Observable<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetWalletAddress]> => {
  return getWallet().pipe(
    map((wallet) => wallet?.address),
  );
};

export const getBalance = (): Observable<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetBalance]> => {
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

export const isConnected = (): Observable<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.IsConnected]> => {
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
