import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { Block, BlockHeader, getBlock, getLatestBlock } from 'decentr-js';

@Injectable()
export class BlocksApiService {
  public getBlock(api: string, height: BlockHeader['height']): Observable<Block> {
    return defer(() => getBlock(api, height));
  }

  public getLatestBlock(api: string): Observable<Block> {
    return defer(() => getLatestBlock(api));
  }
}
