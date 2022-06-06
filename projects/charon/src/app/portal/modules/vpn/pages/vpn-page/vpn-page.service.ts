import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { SentinelDeposit, SentinelNode, SentinelSession, SentinelSubscription } from 'decentr-js';

import { SentinelService } from '@core/services/sentinel';
import { DEFAULT_DENOM, SentinelNodeStatus, SentinelNodeStatusWithSubscriptions } from '@shared/models/sentinel';

@Injectable()
export class VpnPageService {

  constructor(
    private sentinelService: SentinelService,
  ) {
  }

  public getAvailableNodes(): Observable<SentinelNode[]> {
    return this.sentinelService.getNodes(DEFAULT_DENOM);
  }

  public getNodeStatus(address: string): Observable<SentinelNodeStatus | undefined> {
    return this.sentinelService.getNodeStatus(address).pipe(
      catchError(() => of(undefined)),
    );
  }

  public getAvailableNodesDetails(): Observable<SentinelNodeStatusWithSubscriptions[]> {
    return this.getAvailableNodes().pipe(
      mergeMap((nodes) => nodes.length > 0
        ? forkJoin([
          this.getSubscriptionsForAddress(),
          forkJoin(nodes.map((node) => this.getNodeStatus(node.remoteUrl))).pipe(
            map((nodeStatuses) => nodeStatuses.filter(Boolean)),
          ),
        ]).pipe(
          map(([subscriptions, nodesStatuses]) => nodesStatuses.map((nodesStatus) => ({
            ...nodesStatus,
            subscriptions: subscriptions.filter((subscription) => subscription?.node === nodesStatus?.address) || [],
          }))),
        )
        : of([]),
      ),
    );
  }

  public getSubscriptionsForAddress(): Observable<SentinelSubscription[]> {
    return this.sentinelService.getSubscriptionsForAddress();
  }

  public getSessionsForAddress(): Observable<SentinelSession[]> {
    return this.sentinelService.getSessionsForAddress();
  }

  public getDeposit(address: string): Observable<SentinelDeposit | undefined> {
    return this.sentinelService.getDeposit(address);
  }
}
