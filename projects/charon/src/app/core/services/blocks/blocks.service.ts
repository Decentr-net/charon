import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NetworkBrowserStorageService } from '@shared/services/network-storage';
import { Block } from 'decentr-js';
import { switchMap } from 'rxjs/operators';

import { BlocksApiService } from '@core/services/api';


@Injectable()
export class BlocksService {

  constructor(
    private blocksApiService: BlocksApiService,
    private networkBrowserStorageService: NetworkBrowserStorageService,
  ) {
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
