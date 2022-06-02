import { Injectable } from '@angular/core';
import { catchError, combineLatest, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import {
  SentinelDeposit,
  SentinelNode,
  SentinelSession,
  SentinelSubscription,
  transformWalletAddress,
} from 'decentr-js';

import { AuthService } from '@core/auth';
import { SentinelNodeStatus, SentinelService } from '@shared/services/sentinel';
import { Denom } from '@shared/pipes/price';

@Injectable()
export class VpnPageService {

  constructor(
    private authService: AuthService,
    private sentinelService: SentinelService,
  ) {
  }

  public getAvailableNodes(): Observable<SentinelNode[]> {
    return this.sentinelService.getNodes(Denom.IBC_UDEC);
  }

  public getNodeStatus(address: string): Observable<SentinelNodeStatus | undefined> {
    return this.sentinelService.getNodeStatus(address).pipe(
      catchError(() => of(undefined)),
    );
  }

  public getAvailableNodesDetails(): Observable<SentinelNodeStatus[]> {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;
    const sentWalletAddress = transformWalletAddress(walletAddress, 'sent');

    return this.getAvailableNodes().pipe(
      mergeMap((nodes) => nodes.length > 0
        ? combineLatest(
          [
            this.getSubscriptionsForAddress(sentWalletAddress),
            forkJoin([...nodes].map((node) => this.getNodeStatus(node.remoteUrl))),
          ],
        ).pipe(
          map(([subscriptions, nodesStatuses]) => [...nodesStatuses].map((nodesStatus) => nodesStatus
            ? ({
              ...nodesStatus,
              subscriptions: subscriptions.filter((subscription) => subscription?.node === nodesStatus?.address) || [],
            })
            : undefined,
          )),
        )
        : of([]),
      ),
      map((nodes) => nodes.filter((node) => !!node)),
    );
  }

  public getSubscriptionsForAddress(address: string): Observable<SentinelSubscription[]> {
    return this.sentinelService.getSubscriptionsForAddress(address);
  }

  public getSessionsForAddress(address: string): Observable<SentinelSession[]> {
    return this.sentinelService.getSessionsForAddress(address);
  }

  public getDeposit(address: string): Observable<SentinelDeposit | undefined> {
    return this.sentinelService.getDeposit(address);
  }
}
