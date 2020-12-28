import { EMPTY, merge } from 'rxjs';
import {
  catchError,
  delay,
  map,
  mergeMap,
  retryWhen,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { AuthBrowserStorageService } from '../../../shared/services/auth';
import { PDVUpdateNotifier } from '../../../shared/services/pdv';
import { sendCookies } from './background/cookies/api';
import { initMessageListeners, listenAllCookiesSet, listenLoginCookies } from './background/listeners';
import { initAutoLock } from './background/lock';
import { PDVType } from 'decentr-js';
import { browser } from 'webextension-polyfill-ts';

const pdvUpdateNotifier = new PDVUpdateNotifier();
pdvUpdateNotifier.start();

initAutoLock();

// const COOKIES_DEBOUNCE_MS = 500;

const authStorage = new AuthBrowserStorageService();

// authStorage.getActiveUser().pipe(
//   switchMap((user) => {
//     return user && user.registrationCompleted
//       ? merge(
//         listenRequestsOnCompletedWithBody({}, 'POST'),
//         listenRequestsBeforeRedirectWithBody({}, 'POST'),
//       ).pipe(
//         filter(request => {
//           return requestBodyContains(request.requestBody, [
//             ...user.usernames,
//             ...user.emails,
//             user.primaryEmail,
//           ]);
//         }),
//         debounceTime(COOKIES_DEBOUNCE_MS),
//         switchMap(request => getCookies(new URL(request.url))),
//         map((cookies) => ({ user, cookies })),
//       )
//       : EMPTY;
//   }),
//   mergeMap(({ user, cookies }) => {
//     return sendCookies(
//       user.wallet,
//       PDVType.LoginCookie,
//       cookies,
//     ).pipe(
//       retryWhen(errors => errors.pipe(
//         delay(10000),
//         take(60),
//       )),
//       catchError(() => EMPTY),
//     );
//   }),
// ).subscribe(() => {
//   pdvUpdateNotifier.notify();
// });

initMessageListeners();

authStorage.getActiveUser().pipe(
  switchMap((user) => {
    return user && user.registrationCompleted
      ? merge(
        listenLoginCookies([
          ...user.usernames,
          ...user.emails,
          user.primaryEmail,
        ]).pipe(
          map((cookies) => ({ cookies, pdvType: PDVType.LoginCookie })),
        ),
        listenAllCookiesSet().pipe(
          map((cookies) => ({ cookies, pdvType: PDVType.Cookie })),
          tap(console.log),
        ),
      ).pipe(
        mergeMap(({ cookies, pdvType}) => {
          return sendCookies(
            user.wallet,
            pdvType,
            cookies,
          ).pipe(
            retryWhen(errors => errors.pipe(
              delay(10000),
              take(60),
            )),
            catchError(() => EMPTY),
          );
        }),
      )
      : EMPTY;
  }),
).subscribe(() => {
  pdvUpdateNotifier.notify();
});

browser.cookies.onChanged.addListener(console.log);
