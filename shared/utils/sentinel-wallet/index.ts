import { transformWalletAddress } from 'decentr-js';

export const getSentinelWalletAddress = (address: string): string => {
  return transformWalletAddress(address, 'sent');
};
