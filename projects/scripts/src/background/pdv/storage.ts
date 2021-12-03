import { PDV, Wallet } from 'decentr-js';

import { PDVStorageService } from '../../../../../shared/services/pdv/pdv-storage.service';
import { PDVUniqueStore } from './pdv-unique-store';

export const PDV_STORAGE_SERVICE = new PDVStorageService();

export const mergePDVsIntoAccumulated = (
  walletAddress: Wallet['address'],
  pDVs: PDV[],
  preferAccumulated = false,
): Promise<void> => {
  return PDV_STORAGE_SERVICE.getUserAccumulatedPDV(walletAddress)
    .then((accumulated) => {
      return preferAccumulated
        ? new PDVUniqueStore([...pDVs, ...accumulated]).getAll()
        : new PDVUniqueStore([...accumulated, ...pDVs]).getAll();
    })
    .then((newAccumulated) => PDV_STORAGE_SERVICE.setUserAccumulatedPDV(walletAddress, newAccumulated));
};
