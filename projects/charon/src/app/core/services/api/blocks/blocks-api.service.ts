import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { getLatestBlock, Block } from 'decentr-js';

@Injectable()
export class BlocksApiService {
  public getLatestBlock(api: string): Observable<Block> {
    return defer(() => getLatestBlock(api));
  }
}
