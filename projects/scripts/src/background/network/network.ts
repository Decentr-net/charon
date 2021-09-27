import { defer, of, throwError } from 'rxjs';
import { delay, distinctUntilChanged, first, mergeMap, retryWhen, switchMap } from 'rxjs/operators';

import CONFIG_SERVICE from '../config';
import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
import { BlockchainNodeService, NodeAvailability } from '../../../../../shared/services/blockchain-node';
import { ONE_SECOND } from '../../../../../shared/utils/date';

const blockchainNodeService = new BlockchainNodeService();
const networkStorage = new NetworkBrowserStorageService();

const getRandomRest = (): Promise<string> => {
  return defer(() => CONFIG_SERVICE.getMaintenanceStatus().pipe(
    switchMap((isMaintenance) => {
      if (isMaintenance) {
        CONFIG_SERVICE.forceUpdate();
        return throwError(new Error());
      }

      return CONFIG_SERVICE.getRestNodes();
    }),
  )).pipe(
    retryWhen((errors) => errors.pipe(
      delay(ONE_SECOND),
    )),
    mergeMap((nodes) => {
      const random = Math.floor(Math.random() * nodes.length);
      const node = nodes[random];

      return blockchainNodeService.getNodeAvailability(node).pipe(
        mergeMap(isAvailable => isAvailable !== NodeAvailability.Available  ? throwError('error') : of(node)),
      );
    }),
    retryWhen((errors) => errors.pipe(
      delay(ONE_SECOND),
    )),
    first(),
  ).toPromise();
};

const setNetworkId = async (): Promise<void> => {
  let activeNetworkId = await networkStorage.getActiveId().pipe(
    first(),
  ).toPromise();

  const networkIds = await CONFIG_SERVICE.getNetworkIds().pipe(
    first(),
  ).toPromise();

  if (!activeNetworkId || !networkIds.includes(activeNetworkId)) {
    activeNetworkId = networkIds[0];
  }

  return networkStorage.setActiveId(activeNetworkId);
};

const setRandomNetwork = async (): Promise<void> => {
  return getRandomRest()
    .then((api) => networkStorage.setActiveAPI(api));
};

const handleNetworkIdChange = () => {
  networkStorage.getActiveId().pipe(
    distinctUntilChanged(),
    switchMap((id) => id ? setRandomNetwork() : setNetworkId()),
  ).subscribe();
};

export const initNetwork = (): Promise<void> => {
  handleNetworkIdChange();
  return setNetworkId();
};
