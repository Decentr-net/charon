export enum NetworkId {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

export interface VPNServer {
  address: string;
  country: string;
  port: number;
  title: string;
}

export interface Network {
  cerberus: {
    minPDVCount: number;
    maxPDVCount: number;
    url: string;
  };
  maintenance: boolean;
  network: {
    chainId: string;
    rest: string[];
  };
  theseus: {
    url: string;
  };
}

export interface Config {
  minVersion: string;
  networks: Record<NetworkId, Network>;
  vpn: {
    enabled: boolean;
    servers: VPNServer[];
  };
  vulcan: {
    url: string;
  };
  referral: {
    url: string;
  };
  share: {
    url: string;
  };
}
