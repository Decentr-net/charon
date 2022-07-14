import { firstValueFrom } from 'rxjs';
import { PDVType } from 'decentr-js';

import { AuthBrowserStorageService } from '@shared/services/auth';
import { NetworkBrowserStorageService } from '@shared/services/network-storage';
import { PDV_STORAGE_SERVICE } from '../pdv/storage';

const clearBadPDVs = async (): Promise<void> => {
  const users = await firstValueFrom(new AuthBrowserStorageService().getUsers());

  const tasks = users.map(({ wallet: { address } }) => {
    return PDV_STORAGE_SERVICE.getUserAccumulatedPDV(address)
      .then((pdvs) => {
        const correctPDVs = pdvs.filter((pdv) => pdv.type !== PDVType.Cookie || pdv.name);
        return PDV_STORAGE_SERVICE.setUserAccumulatedPDV(address, correctPDVs);
      });
  });

  return Promise.all(tasks).then();
};

const clearNetworkStorage = (): Promise<void> => {
  const networkStorage = new NetworkBrowserStorageService();
  return networkStorage.clear();
};

export const migrate = async (): Promise<void> => {
  await clearBadPDVs();

  await clearNetworkStorage();
};
