import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Block, BlockHeader } from 'decentr-js';
import { mergeMap } from 'rxjs/operators';

import { DecentrService } from '../decentr';

@Injectable()
export class BlocksService {
  constructor(
    private decentrService: DecentrService,
  ) {
  }

  public getBlock(height?: BlockHeader['height']): Observable<Block> {
    return this.decentrService.decentrClient.pipe(
      mergeMap((decentrClient) => decentrClient.blocks.getBlock(height)),
    );
  }
}
