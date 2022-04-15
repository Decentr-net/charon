import { combineLatest, firstValueFrom, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { HermesClient } from 'decentr-js';

import {
  WebpageAPIRequestMessageCode,
  WebpageAPIRequestMessageMap,
  WebpageAPIResponseMessageCode,
  WebpageAPIResponseMessageMap,
} from '../../webpage-api-message-bus';
import { getWallet } from '../common';
import { CONFIG_SERVICE } from '../config';

const getHermesClient = (): Observable<HermesClient> => {
  return CONFIG_SERVICE.getSwapUrl().pipe(
    map((api) => new HermesClient(api)),
  );
};

export const createSwap = (
  params: WebpageAPIRequestMessageMap[WebpageAPIRequestMessageCode.CreateSwap],
): Promise<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.CreateSwap]> => {
  return firstValueFrom(combineLatest([
    getHermesClient(),
    getWallet(),
  ]).pipe(
    switchMap(([hermesClient, wallet]) => hermesClient.swap.createSwap(
      wallet.privateKey,
      params.receiverAddress,
      params.txHash,
      params.signature,
    )),
  ));
};

export const getSwapById = (
  swapId: WebpageAPIRequestMessageMap[WebpageAPIRequestMessageCode.GetSwapById],
): Promise<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetSwapById]> => {
  return firstValueFrom(combineLatest([
    getHermesClient(),
    getWallet(),
  ]).pipe(
    switchMap(([hermesClient, wallet]) => hermesClient.swap.getSwapById(wallet.privateKey, swapId)),
  ));
};

export const getSwapList = (
  params: WebpageAPIRequestMessageMap[WebpageAPIRequestMessageCode.GetSwapList],
): Promise<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetSwapList]> => {
  return firstValueFrom(combineLatest([
    getHermesClient(),
    getWallet(),
  ]).pipe(
    switchMap(([hermesClient, wallet]) => hermesClient.swap.getSwapList(wallet.privateKey, params)),
  ));
};
