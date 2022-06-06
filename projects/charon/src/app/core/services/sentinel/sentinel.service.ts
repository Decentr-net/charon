import { Injectable } from '@angular/core';
import { defer, first, map, Observable, ReplaySubject, switchMap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  Coin,
  Decimal,
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
import { priceFromString } from '@shared/utils/price';
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

  private get sentinelWalletAddress(): string {
    return getSentinelWalletAddress(this.authService.getActiveUserInstant().wallet.address);
  }

  public get sentinelClient(): Observable<SentinelClient> {
    return this.sentinelClient$.pipe(
      first(),
    );
  }

  public createSentinelClient(nodeUrl: string, privateKey: Wallet['privateKey']): Observable<SentinelClient> {
    return defer(() => SentinelClient.create(nodeUrl, {
      gasPrice: new Price(Decimal.fromUserInput('1.7', 6), DEFAULT_DENOM),
      privateKey,
    }));
  }

  public getNodeStatus(url: string): Observable<SentinelNodeStatus> {
    const httpUrl = url.replace('https://', 'http://');

    return defer(() => SentinelClient.getNodeStatus(httpUrl, { timeout: 2000 })).pipe(
      map((node) => ({
        ...node,
        price: priceFromString(node.price).filter((price) => price.denom === DEFAULT_DENOM)[0] || undefined,
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

  public getQuota(id: Long, address: string): Observable<SentinelQuota | undefined> {
    return this.sentinelClient.pipe(
      switchMap((client) => client.subscription.getQuota({ id, address })),
    );
  }

  public getQuotas(id: Long): Observable<SentinelQuota[]> {
    return this.sentinelClient.pipe(
      switchMap((client) => client.subscription.getQuotas({ id })),
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
}
