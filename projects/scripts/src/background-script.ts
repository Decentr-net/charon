import { EMPTY, merge } from 'rxjs';
import {
  catchError,
  delay,
  map,
  mergeMap,
  retryWhen,
  switchMap,
  take,
} from 'rxjs/operators';
import { PDVType } from 'decentr-js';

import { AuthBrowserStorageService } from '../../../shared/services/auth';
import { PDVUpdateNotifier } from '../../../shared/services/pdv';
import { sendCookies } from './background/cookies/api';
import { initMessageListeners, listenAllCookiesSet, listenLoginCookies } from './background/listeners';
import { initAutoLock } from './background/lock';
import { setRandomNetwork } from './background/network-switch';

(async () => {
  await setRandomNetwork();
})();

initAutoLock();

initMessageListeners();

const pdvUpdateNotifier = new PDVUpdateNotifier();
pdvUpdateNotifier.start();

const authStorage = new AuthBrowserStorageService();

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
