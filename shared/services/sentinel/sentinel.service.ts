import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import {
  SentinelDeposit,
  SentinelNode,
  SentinelQuota,
  SentinelSession,
  SentinelStatus,
  SentinelSubscription,
} from 'decentr-js';
import Long from 'long';

import { SentinelApiService } from './sentinel-api.service';
import { SentinelNodeStatus } from '@shared/services/sentinel/sentinel.definitions';
import { priceFromString } from '@shared/utils/price';

@Injectable()
export class SentinelService {

  constructor(
    private sentinelApiService: SentinelApiService,
  ) {
  }

  public getNodes(denomFilter?: string): Observable<SentinelNode[]> {
    return this.sentinelApiService.sentinelClient.pipe(
      switchMap((client) => client.node.getNodes(SentinelStatus.STATUS_ACTIVE)),
      map((nodes) => {
        if (!denomFilter) {
          return nodes;
        }

        return nodes.filter((node) => node.price.some((coin) => coin.denom === denomFilter));
      }),
    );
  }

  public getNode(address: string): Observable<SentinelNode | undefined> {
    return this.sentinelApiService.sentinelClient.pipe(
      switchMap((client) => client.node.getNode(address)),
    );
  }

  public getNodeStatus(url: string): Observable<SentinelNodeStatus> {
    return this.sentinelApiService.getNodeStatus(url).pipe(
      map((node) => ({
        ...node,
        price: priceFromString(node.price),
      })),
    );
  }

  public getSubscriptionsForAddress(address: string): Observable<SentinelSubscription[]> {
    return this.sentinelApiService.sentinelClient.pipe(
      switchMap((client) => client.subscription.getSubscriptionsForAddress({
        status: SentinelStatus.STATUS_ACTIVE,
        address,
      })),
    );
  }

  public getSubscription(id: Long): Observable<SentinelSubscription | undefined> {
    return this.sentinelApiService.sentinelClient.pipe(
      switchMap((client) => client.subscription.getSubscription({ id })),
    );
  }

  public getSessionsForAddress(address: string): Observable<SentinelSession[]> {
    return this.sentinelApiService.sentinelClient.pipe(
      switchMap((client) => client.session.getSessionsForAddress({
        status: SentinelStatus.STATUS_ACTIVE,
        address,
      })),
    );
  }

  public getDeposit(address: string): Observable<SentinelDeposit | undefined> {
    return this.sentinelApiService.sentinelClient.pipe(
      switchMap((client) => client.deposit.getDeposit(address)),
    );
  }

  public getQuotas(id: Long): Observable<SentinelQuota[]> {
    return this.sentinelApiService.sentinelClient.pipe(
      switchMap((client) => client.subscription.getQuotas({ id })),
    );
  }

  public getQuota(id: Long, address: string): Observable<SentinelQuota | undefined> {
    return this.sentinelApiService.sentinelClient.pipe(
      switchMap((client) => client.subscription.getQuota({ id, address })),
    );
  }
}
