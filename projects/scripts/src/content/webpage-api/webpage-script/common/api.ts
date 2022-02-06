import { Observable } from 'rxjs';

import { WebpageAPIMessageBus, WebpageAPIRequestMessageCode } from '../../webpage-api-message-bus';

const messageBus = new WebpageAPIMessageBus();

export const connect = (): void => {
  messageBus.sendRequest(WebpageAPIRequestMessageCode.Connect, undefined);
};

export const getBalance = (): Observable<string> => {
  return messageBus.sendRequest(WebpageAPIRequestMessageCode.GetBalance, undefined);
};

export const getWalletAddress = (): Observable<string> => {
  return messageBus.sendRequest(WebpageAPIRequestMessageCode.GetWalletAddress, undefined);
};

export const isConnected = (): Observable<boolean> => {
  return messageBus.sendRequest(WebpageAPIRequestMessageCode.IsConnected, undefined);
};
