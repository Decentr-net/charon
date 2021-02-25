import { Observable, of, ReplaySubject, throwError } from 'rxjs';
import { delay, first, map, mergeMap, retryWhen } from 'rxjs/operators';

import CONFIG_SERVICE from '../config';
import { environment } from '../../../../../environments/environment';
import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
import { PingService } from '../../../../../shared/services/ping';
import { ONE_SECOND } from '../../../../../shared/utils/date';

const configService = CONFIG_SERVICE;
const pingService = new PingService();

export const NETWORK_READY_SUBJECT = new ReplaySubject<boolean>();

export const getRandomRest = (): Observable<string> => {
  return configService.getRestNodes().pipe(
    mergeMap((nodes) => {
      const random = Math.floor(Math.random() * nodes.length);
      const node = nodes[random];

      return pingService.isServerAvailable(node).pipe(
        mergeMap(isAvailable => !isAvailable ? throwError('error') : of(node)),
      );
    }),
    retryWhen((errors) => errors.pipe(
      delay(ONE_SECOND / 2),
    )),
  );
};

export const setRandomNetwork = async (): Promise<void> => {
  const networkStorage = new NetworkBrowserStorageService();

  const activeNetwork = await networkStorage.getActiveNetwork().pipe(
    first(),
  ).toPromise();

  await networkStorage.clear();

  const defaultNetwork = await getRandomRest().pipe(
    first(),
    map((api) => ({ api })),
  ).toPromise();

  await networkStorage.setDefaultNetwork(defaultNetwork);

  if (activeNetwork?.api === environment.rest.local) {
    return;
  }

  await networkStorage.setActiveNetwork(defaultNetwork);

  NETWORK_READY_SUBJECT.next();
};
