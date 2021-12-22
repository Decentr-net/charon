import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { Block, BlockHeader, DecentrBlocksClient } from 'decentr-js';
import { mergeMap } from 'rxjs/operators';

import { NetworkService } from '@core/services';

@Injectable()
export class BlocksService {
  constructor(
    private networkService: NetworkService,
  ) {
  }

  public getBlock(height?: BlockHeader['height']): Observable<Block> {
    return defer(() => this.createAPIClient()).pipe(
      mergeMap((client) => client.getBlock(height)),
    );
  }

  private createAPIClient(): Promise<DecentrBlocksClient> {
    const api = this.networkService.getActiveNetworkAPIInstant();

    return DecentrBlocksClient.create(api);
  }
}
