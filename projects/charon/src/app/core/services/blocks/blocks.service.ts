import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NetworkBrowserStorageService } from '@shared/services/network-storage';
import { Block, BlockHeader } from 'decentr-js';
import { switchMap } from 'rxjs/operators';

import { BlocksApiService } from '@core/services/api';

@Injectable()
export class BlocksService {

  constructor(
    private blocksApiService: BlocksApiService,
    private networkBrowserStorageService: NetworkBrowserStorageService,
  ) {
  }

  public getBlock(height: BlockHeader['height']): Observable<Block> {
    return this.getActiveNetworkApi().pipe(
      switchMap((api) => this.blocksApiService.getBlock(api, height)),
    );
  }

  public getLatestBlock(): Observable<Block> {
    return this.getActiveNetworkApi().pipe(
      switchMap((api) => this.blocksApiService.getLatestBlock(api)),
    );
  }

  private getActiveNetworkApi(): Observable<string> {
    return this.networkBrowserStorageService.getActiveAPI();
  }
}
