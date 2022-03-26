import { PDV } from 'decentr-js';

import { BrowserLocalStorage } from '../../../../../shared/services/browser-storage';
import { parseDomain, parseExpirationDate } from '../pdv/cookies';
import { PDVUniqueStore } from '../pdv/pdv-unique-store';
import { isCookiePDV } from '../pdv/is-pdv';

interface OldPDVStorage {
  [walletAddress: string]: {
    accumulated: PDV[];
    readyBlocks: {
      id: string;
      pDVs: PDV[];
    }[];
  };
}

const fixPDV = (pdv: PDV): PDV | undefined => {
  if (isCookiePDV(pdv)) {
    const expirationDate = parseExpirationDate(pdv.expirationDate);
    const domain = parseDomain(pdv.domain);

    if (!domain) {
      return undefined;
    }

    return {
      ...pdv,
      expirationDate,
    };
  }

  return pdv;
};

export const migrate = async () => {
  const browserStorage = BrowserLocalStorage.getInstance<{ pdv: OldPDVStorage }>();

  const pdvStorageValue = await browserStorage.get('pdv');

  const newStorageValue = Object.entries(pdvStorageValue || {})
    .reduce((acc, [walletAddress, value]) => {
      const unwrappedReadyBlocks = (value.readyBlocks || [])
        .reduce((blocksAcc, block) => [...blocksAcc, ...block.pDVs], []);

      const newPDVs = new PDVUniqueStore([...unwrappedReadyBlocks, ...value.accumulated || []])
        .getAll()
        .map(fixPDV)
        .filter((pdv) => !!pdv);

      return {
        ...acc,
        [walletAddress]: {
          accumulated: newPDVs,
        },
      };
    }, {});

  await browserStorage.set('pdv', newStorageValue);
};
