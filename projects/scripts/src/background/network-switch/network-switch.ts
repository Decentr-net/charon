import { Observable, of, throwError } from 'rxjs';
import { first, map, mergeMap, retry } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';
import { ConfigService } from '../../../../../shared/services/configuration';
import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
import { PingService } from '../../../../../shared/services/ping';

const configService = new ConfigService(environment);
const pingService = new PingService();

export const getRandomRest = (): Observable<string> => {
  return configService.getRestNodes().pipe(
    mergeMap((nodes) => {
      const random = Math.floor(Math.random() * nodes.length);
      const node = nodes[random];

      return pingService.isServerAvailable(node).pipe(
        mergeMap(isAvailable => !isAvailable ? throwError('error') : of(node)),
      );
    }),
    retry(),
  );
};

export const setRandomNetwork = async (): Promise<void> => {
  const networkStorage = new NetworkBrowserStorageService();

  const activeNetwork = await networkStorage.getActiveNetwork().pipe(
    first(),
  ).toPromise();

  networkStorage.clear();

  const defaultNetwork = await getRandomRest().pipe(
    first(),
    map((api) => ({ api })),
  ).toPromise();

  await networkStorage.setDefaultNetwork(defaultNetwork);

  if (activeNetwork?.api === environment.rest.local) {
    return;
  }

  return networkStorage.setActiveNetwork(defaultNetwork);
};
