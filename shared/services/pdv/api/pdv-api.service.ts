import {
  Decentr,
  KeyPair,
  PDV,
  PDVDetails,
  PDVListItem,
  PDVListPaginationOptions,
  PDVStatItem,
  Wallet
} from 'decentr-js';

export class PDVApiService {
  constructor(private chainId: string) {
  }

  public sendPDV(api: string, keys: KeyPair, pdv: PDV[]): Promise<string> {
    const decentr = this.createDecentrConnector(api);

    return decentr.sendPDV(pdv, keys);
  }

  public getBalance(api: string, walletAddress: Wallet['address']): Promise<number> {
    const decentr = this.createDecentrConnector(api);

    return decentr.getTokenBalance(walletAddress);
  }

  public getPDVList(
    api: string,
    walletAddress: Wallet['address'],
    paginationOptions?: PDVListPaginationOptions,
  ): Promise<PDVListItem[]> {
    const decentr = this.createDecentrConnector(api);

    return decentr.getPDVList(walletAddress, paginationOptions);
  }

  public getPDVDetails(
    api: string,
    address: PDVListItem,
    wallet: Wallet,
  ): Promise<PDVDetails> {
    const decentr = this.createDecentrConnector(api);

    return decentr.getPDVDetails(address, wallet);
  }

  public getPDVStats(api: string, walletAddress: Wallet['address']): Promise<PDVStatItem[]> {
    const decentr = this.createDecentrConnector(api);

    return decentr.getPDVStats(walletAddress);
  }

  private createDecentrConnector(api: string): Decentr {
    return new Decentr(api, this.chainId);
  }
}
