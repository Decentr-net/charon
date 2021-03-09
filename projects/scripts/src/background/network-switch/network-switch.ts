import { Observable, of, ReplaySubject, throwError } from 'rxjs';
import { delay, first, map, mergeMap, retryWhen } from 'rxjs/operators';

import CONFIG_SERVICE from '../config';
import { environment } from '../../../../../environments/environment';
import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
import { BlockchainNodeService, NodeAvailability } from '../../../../../shared/services/blockchain-node';
import { ONE_SECOND } from '../../../../../shared/utils/date';

const configService = CONFIG_SERVICE;
const blockchainNodeService = new BlockchainNodeService(configService);

export const NETWORK_READY_SUBJECT = new ReplaySubject<boolean>();

export const getRandomRest = (): Observable<string> => {
  return configService.getRestNodes().pipe(
    mergeMap((nodes) => {
      const random = Math.floor(Math.random() * nodes.length);
      const node = nodes[random];

      return blockchainNodeService.getNodeAvailability(node).pipe(
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
    const localNodeAvailability = await blockchainNodeService.getNodeAvailability(environment.rest.local, true).toPromise();

    if (localNodeAvailability === NodeAvailability.Available) {
      return;
    }
  }

  await networkStorage.setActiveNetwork(defaultNetwork);

  NETWORK_READY_SUBJECT.next();
};
