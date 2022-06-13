import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { EMPTY, map, Observable, switchMap } from 'rxjs';
import { SentinelQuota, SentinelSession, SentinelSubscription } from 'decentr-js';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SentinelNodeStatusWithSubscriptions } from '@shared/models/sentinel';
import { SentinelService } from '@core/services/sentinel';
import { catchError, finalize } from 'rxjs/operators';
import { SpinnerService } from '@core/services';
import { NotificationService } from '@shared/services/notification';
import { TranslocoService } from '@ngneat/transloco';

@UntilDestroy()
@Component({
  selector: 'app-nodes-expansion-connect',
  templateUrl: './nodes-expansion-connect.component.html',
  styleUrls: ['./nodes-expansion-connect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodesExpansionConnectComponent implements OnInit, OnChanges {
  @Input() public node: SentinelNodeStatusWithSubscriptions;

  @Input() public subscription: SentinelSubscription;

  @Output() public sessionEnded: EventEmitter<void> = new EventEmitter();

  @Output() public sessionStarted: EventEmitter<void> = new EventEmitter();

  public depositCapacity$!: Observable<Omit<SentinelQuota, 'address'>>;

  public activeSessions: SentinelSession[];

  public isConnected: boolean | undefined;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private notificationService: NotificationService,
    private sentinelService: SentinelService,
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
  ) {
  }

  public ngOnChanges(): void {
    this.activeSessions = (this.node.sessions || []).filter((session) => session.node === this.node.address);

    this.isConnected = this.activeSessions.length > 0;
  }

  public ngOnInit(): void {
    this.depositCapacity$ = this.sentinelService.getQuota(this.subscription.id);
  }

  public toggleVPN(): void {
    this.spinnerService.showSpinner();

    const action$ = this.isConnected
      ? this.endSession()
      : this.startSession();

    action$.pipe(
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(() => {
      this.isConnected = !this.isConnected;

      this.notificationService.success(
        this.translocoService.translate('vpn_page.nodes_expansion.connect.notifications.' + (this.isConnected
          ? 'connected'
          : 'disconnected'),
          null,
          'portal',
        ),
      );

      if (this.isConnected) {
        this.sessionStarted.next();
      } else {
        this.sessionEnded.next();
      }

      this.changeDetectorRef.markForCheck();
    });
  }

  public endSession(): Observable<void> {
    const ids = this.activeSessions.map(({ id }) => id);

    return this.sentinelService.endSession(ids);
  }

  public startSession(): Observable<void> {
    return this.sentinelService.getSessionsForAddress().pipe(
      map((sessions) => sessions.map(({ id }) => id)),
      switchMap((sessionsIds) => this.sentinelService.startSession(this.node.address, this.subscription.id, sessionsIds)),
    );
  }
}
