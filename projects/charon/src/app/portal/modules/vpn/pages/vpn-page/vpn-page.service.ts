import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { Coin, SentinelDeposit, SentinelNode } from 'decentr-js';

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
          this.sentinelService.getSubscriptionsForAddress(),
          this.sentinelService.getSessionsForAddress(),
          forkJoin(nodes.map((node) => this.getNodeStatus(node.remoteUrl))).pipe(
            map((nodeStatuses) => nodeStatuses.filter(Boolean)),
          ),
        ]).pipe(
          map(([subscriptions, sessions, nodesStatuses]) => nodesStatuses.map((nodesStatus) => ({
            ...nodesStatus,
            sessions: sessions.filter((session) => session.node === nodesStatus?.address) || [],
            subscriptions: subscriptions.filter((subscription) => subscription?.node === nodesStatus?.address) || [],
          }))),
        )
        : of([]),
      ),
    );
  }

  public getDeposit(address: string): Observable<SentinelDeposit | undefined> {
    return this.sentinelService.getDeposit(address);
  }

  public getBalance(): Observable<Coin[]> {
    return this.sentinelService.getBalance();
  }
}
