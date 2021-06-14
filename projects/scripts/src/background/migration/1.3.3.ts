import { PDVStorageService } from '../../../../../shared/services/pdv';

export const migrate = (): Promise<void> => {
  const pdvStorage = new PDVStorageService();
  return pdvStorage.clear();
};
