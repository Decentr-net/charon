import { PDVType } from 'decentr-js';

export interface Config {
  cerberus: {
    minPDVCount: number;
    maxPDVCount: number;
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
