import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { Coin, SentinelDeposit, SentinelNode } from 'decentr-js';

import { SentinelService } from '@core/services/sentinel';
import { DEFAULT_DENOM, SentinelNodeStatus, SentinelNodeStatusWithSubscriptions } from '@shared/models/sentinel';
import { AppRoute } from '../../../../../app-route';
import { PortalRoute } from '../../../../portal-route';
import { RECEIVER_WALLET_PARAM } from '../../../assets/pages';

@Injectable()
export class VpnPageService {

  constructor(
    private router: Router,
    private sentinelService: SentinelService,
  ) {
  }

  public getAvailableNodes(): Observable<SentinelNode[]> {
    return this.sentinelService.getNodes(DEFAULT_DENOM).pipe(
      catchError(() => EMPTY),
    );
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

  public topUpBalance(): void {
    this.router.navigate(['/', AppRoute.Portal, PortalRoute.Assets, PortalRoute.Transfer], {
      queryParams: {
        [RECEIVER_WALLET_PARAM]: this.sentinelService.sentinelWalletAddress,
      },
    });
  }
}
