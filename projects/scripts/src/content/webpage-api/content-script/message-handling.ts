import { defer, EMPTY, merge, Observable } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

import {
  WebpageAPIMessageBus,
  WebpageAPIRequestMessageCode,
  WebpageAPIRequestMessageMap,
  WebpageAPIResponseErrorMessage,
} from '../webpage-api-message-bus';
import { getPostLink } from './share';

const REQUEST_HANDLER_MAP: Record<
  WebpageAPIRequestMessageCode,
  (params: WebpageAPIRequestMessageMap[WebpageAPIRequestMessageCode]) => Promise<unknown> | Observable<unknown>
> = {
  [WebpageAPIRequestMessageCode.GetPostLink]: getPostLink,
};

export default function handleMessages(): void {
  const webpageAPIMessageBus = new WebpageAPIMessageBus();

  const streams$ = Object.entries(REQUEST_HANDLER_MAP).map(([requestCode, handler]) => {
    return webpageAPIMessageBus.onRequest(requestCode as WebpageAPIRequestMessageCode).pipe(
      mergeMap(({ body, sendResponse }) => defer(() => handler(body)).pipe(
        tap((response) => sendResponse(response as any)),
        catchError((error) => {
          const webpageAPIError = new WebpageAPIResponseErrorMessage(error?.response?.status
              ? {
                code: error.response?.status,
                message: error.response?.data?.error,
              }
              : error
          )

          sendResponse(webpageAPIError);

          return EMPTY;
        }),
      )),
    );
  });

  merge(...streams$).subscribe();
}
