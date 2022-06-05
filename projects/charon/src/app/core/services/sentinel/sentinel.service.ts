import { Injectable } from '@angular/core';
import { defer, first, map, Observable, of, ReplaySubject, switchMap } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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

import { ConfigService } from '@shared/services/configuration';
import { AuthService } from '@core/auth';
import { DEFAULT_DENOM, SentinelNodeStatus } from '@core/services/sentinel';
import { getSentinelWalletAddress } from '@shared/utils/sentinel-wallet';
import { priceFromString } from '@shared/utils/price';

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
      tap(console.log),
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

  public subscribeToNode(nodeAddress: string, deposit: Coin): Observable<boolean> {
    const request = {
      from: this.sentinelWalletAddress,
      address: nodeAddress,
      deposit,
    };

    return this.sentinelClient.pipe(
      switchMap((client) => client.subscription.subscribeToNode(request).signAndBroadcast()),
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
