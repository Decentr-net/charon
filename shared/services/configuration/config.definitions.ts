export interface VPNServer {
  address: string;
  country: string;
  port: number;
  title: string;
}

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
  vpn: {
    enabled: boolean;
    servers: VPNServer[];
  };
  vulcan: {
    url: string;
  };
}

export type MultiConfig = Record<string, Config>;
