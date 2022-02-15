import { SwapDestinationNetwork, SwapDetails, SwapListPaginationOptions } from 'decentr-js';
import { firstValueFrom } from 'rxjs';
import {
  WebpageAPIMessageBus,
  WebpageAPIRequestMessageCode, WebpageAPIResponseMessageCode,
  WebpageAPIResponseMessageMap
} from '../../webpage-api-message-bus';

const messageBus = new WebpageAPIMessageBus();

export const createSwap = (
  address: string,
  network: SwapDestinationNetwork,
): Promise<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.CreateSwap]> => {
  return firstValueFrom(
    messageBus.sendRequest(WebpageAPIRequestMessageCode.CreateSwap, { address, network }),
  );
};

export const getSwapById = (
  swapId: SwapDetails['id'],
): Promise<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetSwapById]> => {
  return firstValueFrom(
    messageBus.sendRequest(WebpageAPIRequestMessageCode.GetSwapById, swapId),
  );
};

export const getSwapFee = (
  address: string,
  network: SwapDestinationNetwork,
  amount: number,
): Promise<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetSwapFee]> => {
  return firstValueFrom(
    messageBus.sendRequest(WebpageAPIRequestMessageCode.GetSwapFee, { address, amount, network }),
  );
};

export const getSwapList = (
  paginationOptions?: SwapListPaginationOptions,
): Promise<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetSwapList]> => {
  return firstValueFrom(
    messageBus.sendRequest(WebpageAPIRequestMessageCode.GetSwapList, paginationOptions),
  );
};
