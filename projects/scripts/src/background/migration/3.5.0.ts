import { PDV } from 'decentr-js';

import { BrowserLocalStorage } from '../../../../../shared/services/browser-storage';
import { PDVUniqueStore } from '../pdv/pdv-unique-store';

interface OldPDVStorage {
  [walletAddress: string]: {
    accumulated: PDV[];
    readyBlocks: {
      id: string;
      pDVs: PDV[];
    }[];
  };
}

export const migrate = async () => {
  const browserStorage = BrowserLocalStorage.getInstance<{ pdv: OldPDVStorage }>();

  const pdvStorageValue = await browserStorage.get('pdv');

  const newStorageValue = Object.entries(pdvStorageValue || {})
    .reduce((acc, [walletAddress, value]) => {
      const unwrappedReadyBlocks = (value.readyBlocks || [])
        .reduce((acc, block) => [...acc, ...block.pDVs], []);

      return {
        ...acc,
        [walletAddress]: {
          accumulated: new PDVUniqueStore([...unwrappedReadyBlocks, ...value.accumulated || []]).getAll(),
        },
      };
    }, {});

  await browserStorage.set('pdv', newStorageValue);
}
