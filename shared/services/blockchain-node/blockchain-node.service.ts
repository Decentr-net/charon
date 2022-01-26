import { defer, Observable, of } from 'rxjs';
import { catchError, mapTo, mergeMap } from 'rxjs/operators';
import { DecentrNodeClient } from 'decentr-js';

export enum NodeAvailability {
  Available,
  Unavailable,
  IncorrectChainId,
}

export class BlockchainNodeService {
  public getNodeAvailability(nodeAddress: string): Observable<NodeAvailability> {
    return defer(() => DecentrNodeClient.create(nodeAddress)).pipe(
      mergeMap((client) => client.getNodeInfo()),
      mapTo(NodeAvailability.Available),
      catchError(() => of(NodeAvailability.Unavailable)),
    );
  }
}
