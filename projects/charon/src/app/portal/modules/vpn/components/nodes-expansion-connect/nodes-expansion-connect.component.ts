import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { SentinelQuota } from 'decentr-js';

import { SentinelNodeStatusWithSubscriptions, SentinelService } from '@core/services/sentinel';

@Component({
  selector: 'app-nodes-expansion-connect',
  templateUrl: './nodes-expansion-connect.component.html',
  styleUrls: ['./nodes-expansion-connect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodesExpansionConnectComponent implements OnInit {
  @Input() public node!: SentinelNodeStatusWithSubscriptions;

  public depositCapacity$!: Observable<Omit<SentinelQuota, 'address'>>;

  public isConnected: boolean | undefined;

  constructor(
    private sentinelService: SentinelService,
  ) {
  }

  public ngOnInit(): void {
    const SentinelQuotaInitial = { allocated: '0', consumed: '0' };

    this.depositCapacity$ = forkJoin(this.node.subscriptions
      .map((subscription) => subscription?.id
        ? this.sentinelService.getQuotas(subscription?.id).pipe(map((quota) => quota[0]))
        : of(SentinelQuotaInitial),
      ),
    ).pipe(
      map((quotas) => quotas.reduce((sum, item) => ({
        allocated: String(+sum.allocated + +item.allocated),
        consumed: String(+sum.consumed + +item?.consumed),
      }), SentinelQuotaInitial)),
    );
  }

  public toggleVPN(): void {
    this.isConnected = !this.isConnected;
  }
}
