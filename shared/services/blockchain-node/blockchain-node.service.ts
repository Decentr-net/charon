import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { getNodeInfo } from 'decentr-js';

import { ConfigService } from '../configuration';

export enum NodeAvailability {
  Available,
  Unavailable,
  IncorrectChainId,
}

@Injectable()
export class BlockchainNodeService {
  constructor(
    private configService: ConfigService,
  ) {
  }

  public getNodeAvailability(nodeAddress: string, checkChainId: boolean = false): Observable<NodeAvailability> {
    return combineLatest([
      this.configService.getChainId(),
      getNodeInfo(nodeAddress),
    ]).pipe(
      map(([chainId, nodeInfo]) => {
        return !checkChainId || chainId === nodeInfo.node_info.network
          ? NodeAvailability.Available
          : NodeAvailability.IncorrectChainId
      }),
      catchError(() => of(NodeAvailability.Unavailable)),
    )
  }
}
