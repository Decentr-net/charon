import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, startWith, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { Coin } from 'decentr-js';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { flagsIcons } from '@shared/svg-icons/flags';
import { svgReload } from '@shared/svg-icons/reload';
import { svgTopup } from '@shared/svg-icons/topup';
import { isOpenedInTab } from '@shared/utils/browser';
import { findCoinByDenom, priceFromString } from '@shared/utils/price';
import { DEFAULT_DENOM, SentinelNodeStatusWithSubscriptions } from '@shared/models/sentinel';
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
  @HostBinding('class.mod-opened-in-tab') public openedInTab: boolean = isOpenedInTab();

  public refreshData$: BehaviorSubject<void> = new BehaviorSubject(undefined);

  public nodes: SentinelNodeStatusWithSubscriptions[] | undefined;

  public balance: Coin;

  public onlySubscribedFormControl: FormControl<boolean> = new FormControl(false);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private vpnPageService: VpnPageService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgReload,
      svgTopup,
      ...flagsIcons,
    ]);
  }

  public ngOnInit(): void {
    const onlySubscribed$ = this.onlySubscribedFormControl.valueChanges.pipe(
      startWith(this.onlySubscribedFormControl.value),
    );

    this.refreshData$.pipe(
      startWith(true),
      tap(() => this.balance = undefined),
      switchMap(() => this.vpnPageService.getBalance()),
      map((balances) => findCoinByDenom(balances, DEFAULT_DENOM) || priceFromString('0' + DEFAULT_DENOM)[0]),
      untilDestroyed(this),
    ).subscribe((balance) => {
      this.balance = balance;

      this.changeDetectorRef.markForCheck();
    });

    combineLatest([
      this.refreshData$.pipe(
        startWith(true),
        tap(() => this.nodes = undefined),
        switchMap(() => this.vpnPageService.getAvailableNodesDetails()),
      ),
      onlySubscribed$,
    ]).pipe(
      map(([nodes, onlySubscribed]) => onlySubscribed ? nodes.filter(({ subscriptions }) => subscriptions?.length) : nodes),
    ).subscribe((nodes) => {
      this.nodes = nodes;

      this.changeDetectorRef.markForCheck();
    });
  }

  public topUpBalance(): void {
    this.vpnPageService.topUpBalance();
  }

  public onRefreshData(): void {
    return this.refreshData$.next();
  }
}
