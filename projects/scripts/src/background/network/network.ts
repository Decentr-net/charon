import { of, ReplaySubject, throwError } from 'rxjs';
import { delay, filter, first, mergeMap, retryWhen, switchMap, tap } from 'rxjs/operators';

import CONFIG_SERVICE from '../config';
import { environment } from '../../../../../environments/environment';
import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
import { BlockchainNodeService, NodeAvailability } from '../../../../../shared/services/blockchain-node';
import { ONE_SECOND } from '../../../../../shared/utils/date';

const configService = CONFIG_SERVICE;
const blockchainNodeService = new BlockchainNodeService(configService);
const networkStorage = new NetworkBrowserStorageService();

export const NETWORK_READY_SUBJECT = new ReplaySubject<boolean>(1);

const getRandomRest = (): Promise<string> => {
  return configService.getRestNodes().pipe(
    mergeMap((nodes) => {
      const random = Math.floor(Math.random() * nodes.length);
      const node = nodes[random];

      return blockchainNodeService.getNodeAvailability(node).pipe(
        mergeMap(isAvailable => isAvailable !== NodeAvailability.Available  ? throwError('error') : of(node)),
      );
    }),
    retryWhen((errors) => errors.pipe(
      delay(ONE_SECOND / 2),
    )),
    first(),
  ).toPromise();
};

const setRandomNetwork = async (): Promise<void> => {
  const activeNetwork = await networkStorage.getActiveNetwork().pipe(
    first(),
  ).toPromise();

  await networkStorage.clear();

  const defaultNetwork = await getRandomRest().then((api) => ({ api }));

  await networkStorage.setDefaultNetwork(defaultNetwork);

  if (!activeNetwork) {
    await networkStorage.setActiveNetwork(defaultNetwork);

    return NETWORK_READY_SUBJECT.next();
  }

  if (activeNetwork.api === environment.rest.local) {
    const localNodeAvailability = await blockchainNodeService.getNodeAvailability(environment.rest.local, true).pipe(
      first(),
    ).toPromise();

    if (localNodeAvailability === NodeAvailability.Available) {
      return NETWORK_READY_SUBJECT.next();
    }
  }

  await networkStorage.setActiveNetwork(defaultNetwork);
  NETWORK_READY_SUBJECT.next();
};

const handleNetworkReset = () => {
  NETWORK_READY_SUBJECT.pipe(
    first(),
    switchMap(() => networkStorage.getActiveNetwork()),
    tap(console.log),
    filter((network) => !network),
    switchMap(() => setRandomNetwork()),
  ).subscribe();
};

export const initNetwork = (): Promise<void> => {
  handleNetworkReset();
  return setRandomNetwork();
};
