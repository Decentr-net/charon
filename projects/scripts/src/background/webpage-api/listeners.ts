import { defer, EMPTY } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { MessageBus } from '@shared/message-bus';
import { WebpageAPIMessageBusMap } from './message-bus-map';
import { WebpageAPIMessageCode } from './messages';
import { openExtension, openPost, unlock } from './api';

export const initWebpageAPIListeners = () => {
  const messageBus = new MessageBus<WebpageAPIMessageBusMap>();

  messageBus.onMessage(WebpageAPIMessageCode.OpenPost)
    .pipe(
      mergeMap(({ body, sendResponse }) => defer(() => openPost(body.post, body.networkId)).pipe(
        catchError((error) => {
          sendResponse({ error });
          return EMPTY;
        }),
      )),
    ).subscribe();

  messageBus.onMessageSync(WebpageAPIMessageCode.OpenExtension)
    .subscribe(() => openExtension());

  messageBus.onMessageSync(WebpageAPIMessageCode.Unlock)
    .subscribe(() => unlock());
};
