import { combineLatest, EMPTY, firstValueFrom, Observable, of, tap, throwError } from 'rxjs';
import { distinctUntilChanged, filter, first, mergeMap, retry, switchMap } from 'rxjs/operators';

import CONFIG_SERVICE from '../config';
import { NetworkBrowserStorageService } from '../../../../../shared/services/network-storage';
import { BlockchainNodeService } from '../../../../../shared/services/blockchain-node';
import { ONE_SECOND } from '../../../../../shared/utils/date';

const blockchainNodeService = new BlockchainNodeService();
const networkStorage = new NetworkBrowserStorageService();

const getRandomRest = (): Observable<string> => {
  return CONFIG_SERVICE.getMaintenanceStatus().pipe(
    switchMap((isMaintenance) => isMaintenance
      ? throwError(() => new Error())
      : CONFIG_SERVICE.getRestNodes(),
    ),
    retry({
      delay: ONE_SECOND * 5,
    }),
    mergeMap((nodes) => {
      const random = Math.floor(Math.random() * nodes.length);
      const node = nodes[random];

      return blockchainNodeService.getNodeAvailability(node).pipe(
        mergeMap((isAvailable) => isAvailable
          ? of(node)
          : throwError(() => new Error()),
        ),
      );
    }),
    retry({
      delay: ONE_SECOND,
    }),
    first(),
  );
};

const setNetworkId = async (): Promise<void> => {
  let activeNetworkId = await firstValueFrom(networkStorage.getActiveId());

  const networkIds = await firstValueFrom(CONFIG_SERVICE.getNetworkIds());

  if (!activeNetworkId || !networkIds.includes(activeNetworkId)) {
    activeNetworkId = networkIds[0];
  }

  return networkStorage.setActiveId(activeNetworkId);
};

const setRandomNetwork = (): Observable<void> => (() => {
  let isSettingNetwork = false;

  return getRandomRest().pipe(
    filter(() => !isSettingNetwork),
    tap(() => isSettingNetwork = true),
    mergeMap((api) => networkStorage.setActiveAPI(api)),
    tap(() => isSettingNetwork = false),
  );
})();

const handleNetworkIdChange = () => {
  networkStorage.getActiveId().pipe(
    distinctUntilChanged(),
    switchMap((id) => id ? setRandomNetwork() : setNetworkId()),
  ).subscribe();
};

const handleNodeListChange = () => {
  combineLatest([
    networkStorage.getActiveAPI(),
    CONFIG_SERVICE.getRestNodes(true),
  ]).pipe(
    switchMap(([activeNode, nodes]) => (!activeNode || nodes.includes(activeNode)) ? EMPTY : setRandomNetwork()),
  ).subscribe();
};

export const initNetwork = (): Promise<void> => {
  handleNetworkIdChange();
  handleNodeListChange();

  return firstValueFrom(networkStorage.getActiveId()).then();
};
