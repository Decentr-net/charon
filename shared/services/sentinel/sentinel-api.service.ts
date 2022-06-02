import { Injectable } from '@angular/core';
import { defer, first, Observable, ReplaySubject, switchMap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SentinelClient } from 'decentr-js';

import { ConfigService } from '../configuration';

@UntilDestroy()
@Injectable()
export class SentinelApiService {

  private sentinelClient$: ReplaySubject<SentinelClient> = new ReplaySubject(1);

  constructor(
    private configService: ConfigService,
  ) {
    this.configService.getVpnUrl().pipe(
      switchMap((vpnUrl) => this.createSentinelClient(vpnUrl)),
      untilDestroyed(this),
    ).subscribe((client) => this.sentinelClient$.next(client));
  }

  public get sentinelClient(): Observable<SentinelClient> {
    return this.sentinelClient$.pipe(
      first(),
    );
  }

  public createSentinelClient(nodeUrl: string): Observable<SentinelClient> {
    return defer(() => SentinelClient.create(nodeUrl));
  }

  public getNodeStatus(url: string) {
    const httpUrl = url.replace('https://', 'http://');

    return defer(() => SentinelClient.getNodeStatus(httpUrl, { timeout: 2000 }));
  }
}
