import { defer, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DecentrClient } from 'decentr-js';

export class BlockchainNodeService {
  public getNodeAvailability(nodeAddress: string): Observable<boolean> {
    return defer(() => DecentrClient.create(nodeAddress)).pipe(
      mergeMap((client) => client.status()),
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
