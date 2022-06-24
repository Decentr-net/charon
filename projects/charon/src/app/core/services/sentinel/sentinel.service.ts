import { Injectable } from '@angular/core';
import { defer, forkJoin, Observable, of, ReplaySubject, switchMap } from 'rxjs';
import { catchError, combineLatestWith, filter, first, map, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  AddSessionResponse,
  Coin, Decimal,
  EndSessionRequest, Price,
  SentinelClient,
  SentinelDeposit,
  SentinelNode,
  SentinelQuota,
  SentinelSession,
  SentinelStatus,
  SentinelSubscription,
  transformWalletAddress,
  WalletPrefix,
} from 'decentr-js';
import Long from 'long';

import { assertMessageResponseSuccess, CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';
import { ConfigService } from '@shared/services/configuration';
import { MessageBus } from '@shared/message-bus';
import { coerceCoin } from '@shared/utils/price';
import { httpUrl } from '@shared/utils/http';
import { ONE_SECOND } from '@shared/utils/date';
import { AuthService } from '@core/auth';
import { DEFAULT_DENOM, SentinelNodeStatus } from './sentinel.definitions';
import { countryNameToCode } from './sentinel-utils';

@UntilDestroy()
@Injectable()
export class SentinelService {

  private sentinelClient$: ReplaySubject<SentinelClient> = new ReplaySubject(1);

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    this.configService.getVpnUrl(true).pipe(
      combineLatestWith(this.authService.getActiveUser()),
      tap(() => this.sentinelClient$.next(undefined)),
      switchMap(([vpnUrl, user]) => SentinelClient.create(vpnUrl, {
        gasPrice: new Price(Decimal.fromUserInput('1.7', 6), DEFAULT_DENOM),
        privateKey: user?.wallet?.privateKey,
      })),
      untilDestroyed(this),
    ).subscribe((client) => this.sentinelClient$.next(client));
  }

  public get sentinelWalletAddress(): string {
    return transformWalletAddress(
      this.authService.getActiveUserInstant().wallet.address,
      WalletPrefix.Sentinel,
    );
  }

  private get sentinelClient(): Observable<SentinelClient> {
    return this.sentinelClient$.pipe(
      filter((client) => !!client),
      first(),
    );
  }

  private buildEndSessionRequest(ids: Long[]): EndSessionRequest {
    return ids.map((id) => ({
      id,
      from: this.sentinelWalletAddress,
      rating: Long.fromInt(0),
    }));
  }

  public getNodeStatus(nodeUrl: string): Observable<SentinelNodeStatus> {
    return defer(() => SentinelClient.getNodeStatus(httpUrl(nodeUrl), { timeout: ONE_SECOND * 2 })).pipe(
      map((node) => ({
        ...node,
        countryCode: countryNameToCode(node.location.country),
        price: coerceCoin(node.price).find((price) => price.denom === DEFAULT_DENOM),
        remoteUrl: nodeUrl,
      })),
      catchError(() => of(undefined)),
    );
  }

  public getNodes(denom?: string): Observable<SentinelNode[]> {
    return this.sentinelClient.pipe(
      switchMap((client) => forkJoin([
        client.node.getNodes(SentinelStatus.STATUS_ACTIVE),
        this.configService.getVpnFilterLists(),
      ])),
      map(([nodes, filterLists]) => {
        return nodes
          .filter((node) => !filterLists.blackList.includes(node.address))
          .filter((node) => !filterLists.whiteList.length || filterLists.whiteList.includes(node.address))
          .filter((node) => !denom || node.price.some((coin) => coin.denom === denom));
      }),
      tap((nodes) => console.log('nodes', nodes)),
    );
  }

  public getSubscriptionsForAddress(): Observable<SentinelSubscription[]> {
    return this.sentinelClient.pipe(
      switchMap((client) => client.subscription.getSubscriptionsForAddress({
        status: SentinelStatus.STATUS_ACTIVE,
        address: this.sentinelWalletAddress,
      })),
      tap((subscriptions) => console.log('subscriptions', subscriptions)),
    );
  }

  public getSessionsForAddress(): Observable<SentinelSession[]> {
    return this.sentinelClient.pipe(
      switchMap((client) => client.session.getSessionsForAddress({
        status: SentinelStatus.STATUS_ACTIVE,
        address: this.sentinelWalletAddress,
      })),
    );
  }

  public getDeposit(address: string): Observable<SentinelDeposit | undefined> {
    return this.sentinelClient.pipe(
      switchMap((client) => client.deposit.getDeposit(address)),
    );
  }

  public getQuota(subscriptionId: Long): Observable<SentinelQuota | undefined> {
    return this.sentinelClient.pipe(
      switchMap((client) => client.subscription.getQuota({
        address: this.sentinelWalletAddress,
        id: subscriptionId,
      })),
    );
  }

  public getQuotas(subscriptionId: Long): Observable<SentinelQuota[]> {
    return this.sentinelClient.pipe(
      switchMap((client) => client.subscription.getQuotas({ id: subscriptionId })),
    );
  }

  public getBalance(): Observable<Coin[]> {
    return this.sentinelClient.pipe(
      switchMap((client) => client.bank.getBalance(this.sentinelWalletAddress)),
    );
  }

  public addSession(nodeUrl: string, sessionId: Long): Observable<AddSessionResponse> {
    return this.sentinelClient.pipe(
      switchMap((client) => client.session.addSession(httpUrl(nodeUrl), sessionId)),
    );
  }

  public subscribeToNode(nodeAddress: string, deposit: Coin): Observable<void> {
    return defer(() => new MessageBus<CharonAPIMessageBusMap>().sendMessage(
      MessageCode.SentinelSubscribeToNode,
      {
        request: {
          from: this.sentinelWalletAddress,
          address: nodeAddress,
          deposit,
        },
      },
    )).pipe(
      map(assertMessageResponseSuccess),
    );
  }

  public cancelSubscription(id: Long): Observable<void> {
    return defer(() => new MessageBus<CharonAPIMessageBusMap>().sendMessage(
      MessageCode.SentinelCancelNodeSubscription,
      {
        request: {
          from: this.sentinelWalletAddress,
          id,
        },
      },
    )).pipe(
      map(assertMessageResponseSuccess),
    );
  }

  public startSession(nodeAddress: string, subscriptionId: Long, endSessionIds: Long[]): Observable<void> {
    const endSessionRequest = this.buildEndSessionRequest(endSessionIds);

    const startSessionRequest = {
      from: this.sentinelWalletAddress,
      id: subscriptionId,
      node: nodeAddress,
    };

    return defer(() => new MessageBus<CharonAPIMessageBusMap>().sendMessage(
      MessageCode.SentinelStartSession,
      {
        request: {
          endSession: endSessionRequest,
          startSession: startSessionRequest,
        },
      },
    )).pipe(
      map(assertMessageResponseSuccess),
    );
  }

  public endSession(sessionIds: Long[]): Observable<void> {
    return defer(() => new MessageBus<CharonAPIMessageBusMap>().sendMessage(
      MessageCode.SentinelEndSession,
      { request: this.buildEndSessionRequest(sessionIds) },
    )).pipe(
      map(assertMessageResponseSuccess),
    );
  }
}
