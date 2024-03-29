import { defer, EMPTY, merge, Observable } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

import {
  WebpageAPIMessageBus,
  WebpageAPIRequestMessageCode,
  WebpageAPIRequestMessageMap,
  WebpageAPIResponseErrorMessage,
} from '../webpage-api-message-bus';
import { connect, getBalance, getMaintenance, getNetwork, getWalletAddress, isConnected } from './common';
import { openPost } from './share';
import { createSwap, getSwapById, getSwapList } from './swap';

const REQUEST_HANDLER_MAP: Record<WebpageAPIRequestMessageCode, (params: WebpageAPIRequestMessageMap[WebpageAPIRequestMessageCode]) => Promise<unknown> | Observable<unknown>> = {
  [WebpageAPIRequestMessageCode.Connect]: connect,
  [WebpageAPIRequestMessageCode.CreateSwap]: createSwap,
  [WebpageAPIRequestMessageCode.GetBalance]: getBalance,
  [WebpageAPIRequestMessageCode.GetMaintenance]: getMaintenance,
  [WebpageAPIRequestMessageCode.GetNetwork]: getNetwork,
  [WebpageAPIRequestMessageCode.GetSwapById]: getSwapById,
  [WebpageAPIRequestMessageCode.GetSwapList]: getSwapList,
  [WebpageAPIRequestMessageCode.GetWalletAddress]: getWalletAddress,
  [WebpageAPIRequestMessageCode.IsConnected]: isConnected,
  [WebpageAPIRequestMessageCode.OpenPost]: openPost,
};

export default function handleMessages(): void {
  const webpageAPIMessageBus = new WebpageAPIMessageBus();

  const streams$ = Object.entries(REQUEST_HANDLER_MAP).map(([requestCode, handler]) => {
    return webpageAPIMessageBus.onRequest(requestCode as WebpageAPIRequestMessageCode).pipe(
      mergeMap(({ body, sendResponse }) => defer(() => handler(body)).pipe(
        tap((response) => sendResponse(response as never)),
        catchError((error) => {
          const webpageAPIError = new WebpageAPIResponseErrorMessage(error?.response?.status
            ? {
              code: error.response?.status,
              message: error.response?.data?.error,
            }
            : error,
          );

          sendResponse(webpageAPIError);

          return EMPTY;
        }),
      )),
    );
  });

  merge(...streams$).subscribe();
}
