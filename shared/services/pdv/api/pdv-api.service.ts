import {
  Decentr,
  PDV,
  PDVDetails,
  PDVListItem,
  PDVListPaginationOptions,
  PDVStatItem,
  Wallet
} from 'decentr-js';

export class PDVApiService {
  constructor(
    private cerberusUrl: string,
    private chainId: string,
  ) {
  }

  public sendPDV(api: string, wallet: Wallet, pdv: PDV[]): Promise<void> {
    const decentr = this.createDecentrConnector(api);

    return decentr.sendPDV(this.cerberusUrl, pdv, wallet).then(() => void 0);
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

    return decentr.getPDVList(this.cerberusUrl, walletAddress, paginationOptions);
  }

  public getPDVDetails(
    api: string,
    address: PDVListItem,
    wallet: Wallet,
  ): Promise<PDVDetails> {
    const decentr = this.createDecentrConnector(api);

    return decentr.getPDVDetails(this.cerberusUrl, address, wallet);
  }

  public getPDVStats(api: string, walletAddress: Wallet['address']): Promise<PDVStatItem[]> {
    const decentr = this.createDecentrConnector(api);

    return decentr.getPDVStats(walletAddress);
  }

  private createDecentrConnector(api: string): Decentr {
    return new Decentr(api, this.chainId);
  }
}
