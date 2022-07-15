import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { SentinelQuota } from 'decentr-js';
import Long from 'long';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SentinelService } from '@core/services';
import { isOpenedInTab } from '@shared/utils/browser';

@UntilDestroy()
@Component({
  selector: 'app-node-subscription',
  templateUrl: './node-subscription.component.html',
  styleUrls: ['./node-subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeSubscriptionComponent implements OnInit {
  public isOpenedInTab = isOpenedInTab();

  @Input() public subscriptionId: Long;

  @Input() public subscriptionStatusAt: Date;

  @Input() public isConnected: boolean;

  @Input() public isConnectedToWireguard: boolean;

  @Output() public connect: EventEmitter<void> = new EventEmitter();

  @Output() public disconnect: EventEmitter<void> = new EventEmitter();

  @Output() public cancel: EventEmitter<void> = new EventEmitter();

  public quota: SentinelQuota;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sentinelService: SentinelService,
  ) {
  }

  public ngOnInit(): void {
    this.sentinelService.getQuota(this.subscriptionId).pipe(
      untilDestroyed(this),
    ).subscribe((quota) => {
      this.quota = quota;

      this.changeDetectorRef.markForCheck();
    });
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  public onDisconnect(): void {
    this.disconnect.emit();
  }

  public onConnect(): void {
    this.connect.emit();
  }
}
