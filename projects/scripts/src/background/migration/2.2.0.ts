import { AuthBrowserStorageService } from '../../../../../shared/services/auth';
import { PDV_STORAGE_SERVICE } from '../pdv/storage';
import { take } from 'rxjs/operators';
import { PDVType } from 'decentr-js';

const clearBadPDVs = async (): Promise<void> => {
  const users = await new AuthBrowserStorageService().getUsers().pipe(
    take(1),
  ).toPromise();

  const tasks = users.map(({ wallet: { address } }) => {
    return PDV_STORAGE_SERVICE.getUserAccumulatedPDV(address)
      .then((pdvs) => {
        const correctPDVs = pdvs.filter((pdv) => pdv.type !== PDVType.Cookie || pdv.name);
        return PDV_STORAGE_SERVICE.setUserAccumulatedPDV(address, correctPDVs);
      });
  });

  return Promise.all(tasks).then();
};

export const migrate = async (): Promise<void> => {
  await clearBadPDVs();
};
