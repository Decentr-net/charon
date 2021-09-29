import { Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { catchError, mapTo } from 'rxjs/operators';
import { getNodeInfo } from 'decentr-js';

export enum NodeAvailability {
  Available,
  Unavailable,
  IncorrectChainId,
}

@Injectable()
export class BlockchainNodeService {
  public getNodeAvailability(nodeAddress: string): Observable<NodeAvailability> {
    return defer(() => getNodeInfo(nodeAddress)).pipe(
      mapTo(NodeAvailability.Available),
      catchError(() => of(NodeAvailability.Unavailable)),
    );
  }
}
