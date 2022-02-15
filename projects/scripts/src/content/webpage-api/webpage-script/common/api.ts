import { Observable } from 'rxjs';

import {
  WebpageAPIMessageBus,
  WebpageAPIRequestMessageCode,
  WebpageAPIResponseMessageCode,
  WebpageAPIResponseMessageMap,
} from '../../webpage-api-message-bus';

const messageBus = new WebpageAPIMessageBus();

export const connect = (): void => {
  messageBus.sendRequest(WebpageAPIRequestMessageCode.Connect, undefined);
};

export const getNetwork = (): Observable<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetNetwork]> => {
  return messageBus.sendRequest(WebpageAPIRequestMessageCode.GetNetwork, undefined);
};

export const getBalance = (): Observable<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetBalance]> => {
  return messageBus.sendRequest(WebpageAPIRequestMessageCode.GetBalance, undefined);
};

export const getWalletAddress = (): Observable<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.GetWalletAddress]> => {
  return messageBus.sendRequest(WebpageAPIRequestMessageCode.GetWalletAddress, undefined);
};

export const isConnected = (): Observable<WebpageAPIResponseMessageMap[WebpageAPIResponseMessageCode.IsConnected]> => {
  return messageBus.sendRequest(WebpageAPIRequestMessageCode.IsConnected, undefined);
};
