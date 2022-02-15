import { combineLatest, firstValueFrom, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { HermesClient } from 'decentr-js';

import CONFIG_SERVICE from '../../../../background/config';
import {
  WebpageAPIRequestMessageCode,
  WebpageAPIRequestMessageMap,
  WebpageAPIResponseMessageCode,
  WebpageAPIResponseMessageMap,
} from '../../webpage-api-message-bus';
import { getWallet } from '../common';

const getHermesClient = (): Observable<HermesClient> => {
  return CONFIG_SERVICE.getSwapUrl().pipe(
    map((api) => new HermesClient(api)),
  );
}

export const createSwap = (
  params: WebpageAPIRequestMessageMap[WebpageAPIRequestMessageCode.CreateSwap],
): Promise<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.CreateSwap]> => {
  return firstValueFrom(combineLatest([
    getHermesClient(),
    getWallet(),
  ]).pipe(
    switchMap(([hermesClient, wallet]) => hermesClient.swap.createSwap(wallet, params.address, params.network))
  ));
};

export const getSwapById = (
  swapId: WebpageAPIRequestMessageMap[WebpageAPIRequestMessageCode.GetSwapById],
): Promise<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetSwapById]> => {
  return firstValueFrom(combineLatest([
    getHermesClient(),
    getWallet(),
  ]).pipe(
    switchMap(([hermesClient, wallet]) => hermesClient.swap.getSwapById(wallet, swapId)),
  ));
};

export const getSwapFee = (
  params: WebpageAPIRequestMessageMap[WebpageAPIRequestMessageCode.GetSwapFee],
): Promise<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetSwapFee]> => {
  return firstValueFrom(getHermesClient())
    .then((hermesClient) => hermesClient.swap.getFee(params.address, params.network, params.amount));
};

export const getSwapList = (
  params: WebpageAPIRequestMessageMap[WebpageAPIRequestMessageCode.GetSwapList],
): Promise<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetSwapList]> => {
  return firstValueFrom(combineLatest([
    getHermesClient(),
    getWallet(),
  ]).pipe(
    switchMap(([hermesClient, wallet]) => hermesClient.swap.getSwapList(wallet, params)),
  ));
};
