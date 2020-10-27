export const chainId = 'testnet';

export interface PDVData {
  readonly version: string;
  readonly type: 'cookie';
  readonly name: string;
  readonly value: string;
  readonly domain: string;
  readonly host_only: boolean;
  readonly path: string;
  readonly secure: boolean
  readonly same_site: string;
  readonly expiration_date: number;
}

export interface PDV {
  readonly version: string;
  readonly pdv: {
    readonly domain: string;
    readonly path: string;
    readonly data: PDVData[];
  };
}

export interface PDVListItem {
  readonly timestamp: number;
  readonly address: string;
  readonly owner: string;
  readonly type: string;
}
