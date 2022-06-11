import { Injectable } from '@angular/core';
import { defer, first, map, Observable, ReplaySubject, switchMap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  Coin,
  Decimal,
  EndSessionRequest,
  Price,
  SentinelClient,
  SentinelDeposit,
  SentinelNode,
  SentinelQuota,
  SentinelSession,
  SentinelStatus,
  SentinelSubscription,
  Wallet,
} from 'decentr-js';
import Long from 'long';

import { AuthService } from '@core/auth';
import { ConfigService } from '@shared/services/configuration';
import { DEFAULT_DENOM, SentinelNodeStatus } from '@shared/models/sentinel';
import { getSentinelWalletAddress } from '@shared/utils/sentinel-wallet';
import { MessageBus } from '@shared/message-bus';
import { coerceCoin } from '@shared/utils/price';
import { assertMessageResponseSuccess, CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';

@UntilDestroy()
@Injectable()
export class SentinelService {

  private sentinelClient$: ReplaySubject<SentinelClient> = new ReplaySubject(1);

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const privateKey = authService.getActiveUserInstant().wallet.privateKey;

    this.configService.getVpnUrl().pipe(
      switchMap((vpnUrl) => this.createSentinelClient(vpnUrl, privateKey)),
      untilDestroyed(this),
    ).subscribe((client) => this.sentinelClient$.next(client));
  }

  public get sentinelWalletAddress(): string {
    return getSentinelWalletAddress(this.authService.getActiveUserInstant().wallet.address);
  }

  private get sentinelClient(): Observable<SentinelClient> {
    return this.sentinelClient$.pipe(
      first(),
    );
  }

  private createSentinelClient(nodeUrl: string, privateKey: Wallet['privateKey']): Observable<SentinelClient> {
    return defer(() => SentinelClient.create(nodeUrl, {
      gasPrice: new Price(Decimal.fromUserInput('1.7', 6), DEFAULT_DENOM),
      privateKey,
    }));
  }

  private buildEndSessionRequest(ids: Long[]): EndSessionRequest {
    return ids.map((id) => ({
      from: this.sentinelWalletAddress,
      id: id,
      rating: Long.fromInt(0),
    }));
  }

  public getNodeStatus(url: string): Observable<SentinelNodeStatus> {
    const httpUrl = url.replace('https://', 'http://');

    return defer(() => SentinelClient.getNodeStatus(httpUrl, { timeout: 2000 })).pipe(
      map((node) => ({
        ...node,
        price: coerceCoin(node.price).filter((price) => price.denom === DEFAULT_DENOM)[0] || undefined,
      })),
    );
  }

  public getNodes(denomFilter?: string): Observable<SentinelNode[]> {
    return this.sentinelClient.pipe(
      switchMap((client) => client.node.getNodes(SentinelStatus.STATUS_ACTIVE)),
      map((nodes) => {
        if (!denomFilter) {
          return nodes;
        }

        return nodes.filter((node) => node.price.some((coin) => coin.denom === denomFilter));
      }),
    );
  }

  public getSubscriptionsForAddress(): Observable<SentinelSubscription[]> {
    return this.sentinelClient.pipe(
      switchMap((client) => client.subscription.getSubscriptionsForAddress({
        status: SentinelStatus.STATUS_ACTIVE,
        address: this.sentinelWalletAddress,
      })),
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

  public getQuota(id: Long): Observable<SentinelQuota | undefined> {
    return this.sentinelClient.pipe(
      switchMap((client) => client.subscription.getQuota({
        address: this.sentinelWalletAddress,
        id,
      })),
    );
  }

  public getQuotas(id: Long): Observable<SentinelQuota[]> {
    return this.sentinelClient.pipe(
      switchMap((client) => client.subscription.getQuotas({ id })),
    );
  }

  public getBalance(): Observable<Coin[]> {
    return this.sentinelClient.pipe(
      switchMap((client) => client.bank.getBalance(this.sentinelWalletAddress)),
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

  public startSession(node: string, startSessionId: Long, endSessionIds: Long[]): Observable<void> {
    const endSessionRequest = this.buildEndSessionRequest(endSessionIds);

    const startSessionRequest = {
      from: this.sentinelWalletAddress,
      id: startSessionId,
      node,
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
