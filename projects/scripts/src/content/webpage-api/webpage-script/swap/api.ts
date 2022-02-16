import { SwapDetails, SwapListPaginationOptions, Wallet } from 'decentr-js';
import { firstValueFrom } from 'rxjs';
import {
  WebpageAPIMessageBus,
  WebpageAPIRequestMessageCode, WebpageAPIResponseMessageCode,
  WebpageAPIResponseMessageMap
} from '../../webpage-api-message-bus';

const messageBus = new WebpageAPIMessageBus();

export const createSwap = (
  receiverAddress: Wallet['address'],
  txHash: string,
): Promise<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.CreateSwap]> => {
  return firstValueFrom(
    messageBus.sendRequest(WebpageAPIRequestMessageCode.CreateSwap, { receiverAddress, txHash }),
  );
};

export const getSwapById = (
  swapId: SwapDetails['id'],
): Promise<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetSwapById]> => {
  return firstValueFrom(
    messageBus.sendRequest(WebpageAPIRequestMessageCode.GetSwapById, swapId),
  );
};

export const getSwapList = (
  paginationOptions?: SwapListPaginationOptions,
): Promise<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetSwapList]> => {
  return firstValueFrom(
    messageBus.sendRequest(WebpageAPIRequestMessageCode.GetSwapList, paginationOptions),
  );
};
