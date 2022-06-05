import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { combineLatest, map, startWith } from 'rxjs';
import { FormControl } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { flagsIcons } from '@shared/svg-icons/flags';
import { isOpenedInTab } from '@shared/utils/browser';
import { SentinelNodeStatusWithSubscriptions } from '@core/services/sentinel';
import { VpnPageService } from './vpn-page.service';

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
  @HostBinding('class.mod-bordered') public hasBorder: boolean = isOpenedInTab();

  public nodes: SentinelNodeStatusWithSubscriptions[] | undefined;

  public onlySubscribedFormControl: FormControl<boolean> = new FormControl(false);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private vpnPageService: VpnPageService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      ...flagsIcons,
    ]);
  }

  public ngOnInit(): void {
    const onlySubscribed$ = this.onlySubscribedFormControl.valueChanges.pipe(
      startWith(this.onlySubscribedFormControl.value),
    );

    combineLatest([
      this.vpnPageService.getAvailableNodesDetails(),
      onlySubscribed$,
    ]).pipe(
      map(([nodes, onlySubscribed]) => onlySubscribed ? nodes.filter(({ subscriptions }) => subscriptions?.length) : nodes),
    ).subscribe((nodes) => {
      this.nodes = nodes;

      this.changeDetectorRef.markForCheck();
    });
  }
}
