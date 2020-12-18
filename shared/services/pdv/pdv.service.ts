import { BroadcastResponse, Decentr, KeyPair, PDV, PDVDetails, PDVListItem, PDVStatItem, Wallet } from 'decentr-js';

export class PDVService {
  constructor(private chainId: string) {
  }

  public sendPDV(api: string, wallet: Wallet, pdv: PDV): Promise<BroadcastResponse> {
    const decentr = this.createDecentrConnector(api);

    return decentr.sendPDV(pdv, wallet, { broadcast: true });
  }

  public getBalance(api: string, walletAddress: Wallet['address']): Promise<number> {
    const decentr = this.createDecentrConnector(api);

    return decentr.getTokenBalance(walletAddress);
  }

  public getPDVList(api: string, walletAddress: Wallet['address']): Promise<PDVListItem[]> {
    const decentr = this.createDecentrConnector(api);

    return decentr.getPDVList(walletAddress);
  }

  public getPDVDetails(
    api: string,
    address: PDVListItem['address'],
    keyPair: KeyPair,
  ): Promise<PDVDetails> {
    const decentr = this.createDecentrConnector(api);

    return decentr.getPDVDetails(address, keyPair);
  }

  public getPDVStats(api: string, walletAddress: Wallet['address']): Promise<PDVStatItem[]> {
    const decentr = this.createDecentrConnector(api);

    return decentr.getPDVStats(walletAddress);
  }

  private createDecentrConnector(api: string): Decentr {
    return new Decentr(api, this.chainId);
  }
}
