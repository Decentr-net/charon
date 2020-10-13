import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChainService {
  private chainId: string = 'testnet';

  public getChainId(): string {
    return this.chainId;
  }
}
