import { merge, noop, Observable, Subject, timer } from 'rxjs';
import { browser, Cookies } from 'webextension-polyfill-ts';
import {
  debounceTime,
  filter,
  finalize,
  map,
  scan,
  startWith,
  switchMap,
  takeLast,
  takeUntil,
} from 'rxjs/operators';

import { MessageBus } from '../../../../shared/message-bus';
import { ONE_SECOND } from '../../../../shared/utils/date';
import { openCharonPage } from '../../../../shared/utils/navigation';
import { MessageCode } from '../messages';
import {
  listenRequestsBeforeRedirectWithBody,
  listenRequestsOnCompletedWithBody,
  requestBodyContains
} from './requests';
import { getBrowserCookies } from './cookies/browser';
import Cookie = Cookies.Cookie;
import { listenCookiesSet } from './cookies/events';
import { CookieUniqueStore } from './cookies/cookie-unique-store';
import { initCharonAPIListeners } from './charon-api';

export const initMessageListeners = () => {
  const messageBus = new MessageBus();

  messageBus.onMessage(MessageCode.Navigate).subscribe(({ body: routes }) => {
    openCharonPage(routes);
  });

  messageBus.onMessage(MessageCode.ToolbarClose).subscribe(() => {
    messageBus.sendMessageToCurrentTab(MessageCode.ToolbarClose);
  });

  browser.runtime.onConnect.addListener(noop);

  initCharonAPIListeners();
}

export const listenLoginCookies = (loginIdentifiers: string[]): Observable<Cookie[]> => {
  return merge(
    listenRequestsOnCompletedWithBody({}, 'POST'),
    listenRequestsBeforeRedirectWithBody({}, 'POST'),
  ).pipe(
    filter(request => requestBodyContains(request.requestBody, loginIdentifiers)),
    debounceTime(ONE_SECOND),
    switchMap(request => getBrowserCookies(new URL(request.url))),
  );
}

export const listenAllCookiesSet = (): Observable<Cookie[]> => {
  const reset$ = new Subject<void>();

  return reset$.pipe(
    startWith(void 0),
    switchMap(() => listenCookiesSet().pipe(
      filter((cookie) => !cookie.httpOnly && !cookie.session),
      scan((store, cookie) => store.set(cookie), new CookieUniqueStore()),
      takeUntil(timer(ONE_SECOND * 10)),
      takeLast(1),
      map((store) => store.getAll()),
      finalize(() => reset$.next()),
    )),
  );
}
