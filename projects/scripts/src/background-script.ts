import { EMPTY, merge } from 'rxjs';
import { catchError, debounceTime, delay, filter, map, mergeMap, retryWhen, switchMap, take, } from 'rxjs/operators';

import { AuthBrowserStorageService } from '../../../shared/services/auth';
import { PDVUpdateNotifier } from '../../../shared/services/pdv';
import {
  listenRequestsBeforeRedirectWithBody,
  listenRequestsOnCompletedWithBody,
  requestBodyContains,
} from './background/requests';
import { getCookies, sendCookies } from './background/cookies/api';
import { initMessageListeners } from './background/listeners';
import { initAutoLock } from './background/lock';
import { PDVType } from 'decentr-js';

const pdvUpdateNotifier = new PDVUpdateNotifier();
pdvUpdateNotifier.start();

initAutoLock();

const COOKIES_DEBOUNCE_MS = 500;

const authStorage = new AuthBrowserStorageService();

authStorage.getActiveUser().pipe(
  switchMap((user) => {
    return user && user.registrationCompleted
      ? merge(
        listenRequestsOnCompletedWithBody({}, 'POST'),
        listenRequestsBeforeRedirectWithBody({}, 'POST'),
      ).pipe(
        filter(request => {
          return requestBodyContains(request.requestBody, [
            ...user.usernames,
            ...user.emails,
            user.primaryEmail,
          ]);
        }),
        debounceTime(COOKIES_DEBOUNCE_MS),
        switchMap(request => getCookies(new URL(request.url))),
        map((cookies) => ({ user, cookies })),
      )
      : EMPTY;
  }),
  mergeMap(({ user, cookies }) => {
    return sendCookies(
      user.wallet,
      PDVType.LoginCookie,
      cookies,
    ).pipe(
      retryWhen(errors => errors.pipe(
        delay(10000),
        take(60),
      )),
      catchError(() => EMPTY),
    );
  }),
).subscribe(() => {
  pdvUpdateNotifier.notify();
});

initMessageListeners();
