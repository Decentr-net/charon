import { PDV, Wallet } from 'decentr-js';

import { PDVBlock, PDVStorageService } from '../../../../../shared/services/pdv';
import { PDVUniqueStore } from './pdv-unique-store';

export const PDV_STORAGE_SERVICE = new PDVStorageService();

const mergePDVs = (target: PDV[], source: PDV[]): PDV[] => {
  return [...target, ...source]
    .reduce((store, pdv) => store.set(pdv), new PDVUniqueStore())
    .getAll();
};

export const mergePDVsIntoAccumulated = (
  walletAddress: Wallet['address'],
  pDVs: PDV[],
  preferAccumulated = false,
): Promise<void> => {
  return PDV_STORAGE_SERVICE.getUserAccumulatedPDV(walletAddress)
    .then((accumulated) => {
      return preferAccumulated
        ? mergePDVs(pDVs, accumulated || [])
        : mergePDVs(accumulated || [], pDVs);
    })
    .then((newAccumulated) => PDV_STORAGE_SERVICE.setUserAccumulatedPDV(walletAddress, newAccumulated));
};

export const rollbackPDVBlock = (walletAddress: Wallet['address'], blockId: PDVBlock['id']): Promise<void> => {
  return PDV_STORAGE_SERVICE.getUserReadyBlock(walletAddress, blockId)
    .then((block) => PDV_STORAGE_SERVICE.removeUserReadyBlock(walletAddress, blockId).then(() => block.pDVs))
    .then((pDVs) => mergePDVsIntoAccumulated(walletAddress, pDVs, true));
};
