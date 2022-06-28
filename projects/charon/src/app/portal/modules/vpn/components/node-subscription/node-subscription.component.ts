import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { SentinelQuota } from 'decentr-js';
import Long from 'long';

import { SentinelService } from '@core/services';
import { isOpenedInTab } from '@shared/utils/browser';

@Component({
  selector: 'app-node-subscription',
  templateUrl: './node-subscription.component.html',
  styleUrls: ['./node-subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeSubscriptionComponent implements OnInit {
  public isOpenedInTab = isOpenedInTab();

  @Input() public subscriptionId: Long;

  @Input() public isConnected: boolean;

  @Input() public isConnectedToWireguard: boolean;

  @Output() public connect: EventEmitter<void> = new EventEmitter();

  @Output() public disconnect: EventEmitter<void> = new EventEmitter();

  @Output() public cancel: EventEmitter<void> = new EventEmitter();

  public quota$!: Observable<SentinelQuota>;

  constructor(
    private sentinelService: SentinelService,
  ) {
  }

  public ngOnInit(): void {
    this.quota$ = this.sentinelService.getQuota(this.subscriptionId);
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
