import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { combineLatestWith, map, startWith, switchMap, tap } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Coin } from 'decentr-js';

import { svgReload } from '@shared/svg-icons/reload';
import { svgTopup } from '@shared/svg-icons/topup';
import { isOpenedInTab } from '@shared/utils/browser';
import { SentinelExtendedSubscription, SentinelNodeExtendedDetails } from './vpn-page.definitions';
import { VpnPageService } from './vpn-page.service';

@UntilDestroy()
@Component({
  selector: 'app-vpn-page',
  templateUrl: './vpn-page.component.html',
  styleUrls: ['./vpn-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    VpnPageService,
  ],
})
export class VpnPageComponent implements OnInit {
  public isOpenedInTab = isOpenedInTab();

  public onlySubscribedControl: FormControl<boolean> = new FormControl(false);

  public balance$: BehaviorSubject<Coin> = new BehaviorSubject<Coin>(undefined);

  public nodes$: BehaviorSubject<SentinelNodeExtendedDetails[]> = new BehaviorSubject(undefined);

  public isConnectedToWireguard: boolean;

  private refreshAll$: Subject<void> = new Subject();

  private refreshSessions$: Subject<void> = new Subject();

  private refreshSubscriptions$: Subject<void> = new Subject();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private svgIconRegistry: SvgIconRegistry,
    private vpnPageService: VpnPageService,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgReload,
      svgTopup,
    ]);

    this.refreshAll$.pipe(
      startWith(void 0),
      tap(() => this.balance$.next(undefined)),
      switchMap(() => this.vpnPageService.getBalance()),
      untilDestroyed(this),
    ).subscribe((balance) => {
      this.balance$.next(balance);
    });

    this.refreshAll$.pipe(
      startWith(void 0),
      tap(() => this.nodes$.next(undefined)),
      switchMap(() => this.vpnPageService.getNodes({
        subscriptions: this.refreshSubscriptions$,
        sessions: this.refreshSessions$,
      })),
      combineLatestWith(this.onlySubscribedControl.value$),
      map(([nodes, onlySubscribed]) => nodes.filter((node) => !onlySubscribed || node.subscriptions.length > 0)),
      untilDestroyed(this),
    ).subscribe((nodes) => {
      this.nodes$.next(nodes);
    });

    this.refreshAll$.pipe(
      combineLatestWith(this.refreshSessions$),
      startWith(void 0),
      switchMap(() => this.vpnPageService.checkWireguardConnection()),
      untilDestroyed(this),
    ).subscribe((isConnected) => {
      this.isConnectedToWireguard = isConnected;

      this.changeDetectorRef.markForCheck();
    });
  }

  public subscribeToNode(node: SentinelNodeExtendedDetails, deposit: Coin): void {
    this.vpnPageService.subscribeToNode(node, deposit).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.refreshSubscriptions$.next();
    });
  }

  public cancelSubscription(subscription: SentinelExtendedSubscription): void {
    this.vpnPageService.cancelSubscription(subscription.id).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.refreshSubscriptions$.next();
    });
  }

  public connect(node: SentinelNodeExtendedDetails, subscription: SentinelExtendedSubscription): void {
    this.vpnPageService.connect(node, subscription).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.refreshSessions$.next();
    });
  }

  public disconnect(subscription: SentinelExtendedSubscription): void {
    const sessionIds = subscription.sessions.map(({ id }) => id);

    this.vpnPageService.disconnect(sessionIds).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.refreshSessions$.next();
    });
  }

  public topUpBalance(): void {
    this.vpnPageService.topUpBalance();
  }

  public refreshAll(): void {
    return this.refreshAll$.next();
  }
}
