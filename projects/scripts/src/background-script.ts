import { PDVUpdateNotifier } from '../../../shared/services/pdv';
import { initMessageListeners } from './background/listeners';
import { initAutoLock } from './background/lock';
import { setRandomNetwork } from './background/network-switch';
import { initCookiesCollection } from './background/cookies/collection';

(async () => {
  await setRandomNetwork();
})();

initAutoLock();

initMessageListeners();

const pdvUpdateNotifier = new PDVUpdateNotifier();
pdvUpdateNotifier.start();

initCookiesCollection()
  .subscribe(() => pdvUpdateNotifier.notify());

// authStorage.getActiveUser().pipe(
//   switchMap((user) => {
//     return user && user.registrationCompleted
//       ? merge(
//         listenLoginCookies([
//           ...user.usernames,
//           ...user.emails,
//           user.primaryEmail,
//         ]).pipe(
//           map((cookies) => ({ cookies, pdvType: PDVType.LoginCookie })),
//         ),
//         listenAllCookiesSet().pipe(
//           map((cookies) => ({ cookies, pdvType: PDVType.Cookie })),
//         ),
//       ).pipe(
//         mergeMap(({ cookies, pdvType}) => {
//           return sendCookies(
//             user.wallet,
//             pdvType,
//             cookies,
//           ).pipe(
//             retryWhen(errors => errors.pipe(
//               delay(10000),
//               take(60),
//             )),
//             catchError(() => EMPTY),
//           );
//         }),
//       )
//       : EMPTY;
//   }),
// ).subscribe(() => {
//   pdvUpdateNotifier.notify();
// });
