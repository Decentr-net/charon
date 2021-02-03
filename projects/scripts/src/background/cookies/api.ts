// import { defer, Observable } from 'rxjs';
// import { mapTo } from 'rxjs/operators';
// import { Cookies } from 'webextension-polyfill-ts';
// import { PDVType, Wallet } from 'decentr-js';
// import Cookie = Cookies.Cookie;
//
// import { environment } from '../../../../../environments/environment';
// import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
// import { PDVService } from '../../../../../shared/services/pdv';
// import QUEUE, { QueuePriority } from '../queue';
// import { groupCookiesByDomainAndPath } from './grouping';
// import { convertCookiesToPDV } from './convert';
//
// const pdvService = new PDVService(environment.chainId);
// const networkStorage = new NetworkBrowserStorageService();
//
// export const sendPDV = (
//   wallet: Wallet,
//   pdvType: PDVType,
//   cookies: Cookie[],
// ): Observable<void> => {
//   return defer(() => {
//     return Promise.all(groupedCookies.map((group) => {
//       return QUEUE.add(() => pdvService.sendPDV(
//         networkStorage.getActiveNetworkInstant().api,
//         wallet,
//         pdvType,
//         convertCookiesToPDV(group.cookies, group.domain, group.path),
//       ), {
//         priority: QueuePriority.Cookies,
//       });
//     }));
//   }).pipe(
//     mapTo(void 0),
//   );
// }
