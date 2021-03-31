import { PDVDataType } from 'decentr-js';

export interface Config {
  cerberus: {
    minPDVCount: number;
    maxPDVCount: number;
    rewards: Record<PDVDataType, number>;
    url: string;
  };
  maintenance: boolean;
  minVersion: string;
  network: {
    chainId: string;
    rest: string[];
  };
  theseus: {
    url: string;
  };
  vulcan: {
    url: string;
  };
}
