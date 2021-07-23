import { PDV_STORAGE_SERVICE } from '../pdv/storage';

export const migrate = (): Promise<void> => {
  return PDV_STORAGE_SERVICE.clear();
};
