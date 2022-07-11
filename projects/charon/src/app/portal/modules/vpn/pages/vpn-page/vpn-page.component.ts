import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { BehaviorSubject, forkJoin, merge, Subject } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Coin } from 'decentr-js';

import { svgReload } from '@shared/svg-icons/reload';
import { svgTopup } from '@shared/svg-icons/topup';
import { isOpenedInTab } from '@shared/utils/browser';
import { detectOs } from '@shared/utils/os';
import { InfiniteLoadingPresenter } from '@shared/utils/infinite-loading';
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
export class VpnPageComponent extends InfiniteLoadingPresenter<SentinelNodeExtendedDetails> implements OnInit {
  public detectOs = detectOs();

  public isOpenedInTab = isOpenedInTab();

  public onlySubscribedControl: FormControl<boolean> = new FormControl(this.vpnPageService.onlySubscribed$.value);

  public balance$: BehaviorSubject<Coin> = new BehaviorSubject(undefined);

  public isConnectedToWireguard: boolean;

  public isVpnMaintenance: boolean;

  public isWgInstalled: boolean;

  public nodes: SentinelNodeExtendedDetails[];

  private refreshBalance$: Subject<void> = new Subject();

  private refreshAll$: Subject<void> = new Subject();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private svgIconRegistry: SvgIconRegistry,
    private vpnPageService: VpnPageService,
  ) {
    super(vpnPageService);
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgReload,
      svgTopup,
    ]);

    this.vpnPageService.checkWireguardConnection().pipe(
      untilDestroyed(this),
    ).subscribe((status) => {
      this.isConnectedToWireguard = status;

      this.changeDetectorRef.markForCheck();
    });

    forkJoin([
      this.vpnPageService.getVpnMaintenance(),
      this.vpnPageService.isWgInstalled(),
    ]).pipe(
      untilDestroyed(this),
    ).subscribe(([isVpnMaintenance, isWgInstalled]) => {
      this.isVpnMaintenance = isVpnMaintenance;
      this.isWgInstalled = isWgInstalled;

      if (!isVpnMaintenance && isWgInstalled) {
        this.initVpnPage();
      }

      this.changeDetectorRef.markForCheck();
    });
  }

  private initVpnPage(): void {
    this.vpnPageService.init();

    merge(
      this.refreshAll$,
      this.refreshBalance$,
    ).pipe(
      startWith(void 0),
      tap(() => this.balance$.next(undefined)),
      switchMap(() => this.vpnPageService.getBalance()),
      untilDestroyed(this),
    ).subscribe((balance) => {
      this.balance$.next(balance);
    });

    this.onlySubscribedControl.value$.pipe(
      untilDestroyed(this),
    ).subscribe(this.vpnPageService.onlySubscribed$);

    this.list$.pipe(
      untilDestroyed(this),
    ).subscribe((nodes) => {
      this.nodes = nodes;
      this.changeDetectorRef.markForCheck();
    });

    this.refreshAll$.pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.vpnPageService.reload();
    });
  }

  public subscribeToNode(node: SentinelNodeExtendedDetails, deposit: Coin): void {
    this.vpnPageService.subscribeToNode(node, deposit).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.refreshBalance$.next();
    });
  }

  public cancelSubscription(subscription: SentinelExtendedSubscription): void {
    this.vpnPageService.cancelSubscription(subscription.id).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.refreshBalance$.next();
    });
  }

  public connect(node: SentinelNodeExtendedDetails, subscription: SentinelExtendedSubscription): void {
    this.vpnPageService.connect(node, subscription).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.refreshBalance$.next();
    });
  }

  public disconnect(subscription?: SentinelExtendedSubscription): void {
    const sessionIds = subscription?.sessions.map(({ id }) => id) || [];

    this.vpnPageService.disconnect(sessionIds).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.refreshBalance$.next();
    });
  }

  public onInstallWg(): void {
    this.vpnPageService.wgInstall();
  }

  public topUpBalance(): void {
    this.vpnPageService.topUpBalance();
  }

  public refreshAll(): void {
    return this.refreshAll$.next();
  }
}
