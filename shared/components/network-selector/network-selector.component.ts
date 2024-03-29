import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Network, NetworkSelectorTranslations } from './network-selector.definitions';
import { NetworkSelectorService } from './network-selector.service';

import { svgCheck } from '../../svg-icons/check';
import { svgExpandMore } from '../../svg-icons/expand-more';
import { svgSignal } from '../../svg-icons/signal';

@UntilDestroy()
@Component({
  selector: 'app-network-selector',
  templateUrl: './network-selector.component.html',
  styleUrls: ['./network-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkSelectorComponent implements OnInit {
  public activeNetwork: Network;

  public networks$: Observable<Network[]>;

  public translations$: Observable<NetworkSelectorTranslations>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private networkSelectorService: NetworkSelectorService,
    private svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgCheck,
      svgExpandMore,
      svgSignal,
    ]);
  }

  public ngOnInit(): void {
    this.networks$ = this.networkSelectorService.getNetworks();

    this.networkSelectorService.getActiveNetwork().pipe(
      untilDestroyed(this),
    ).subscribe((activeNetwork) => {
      this.activeNetwork = activeNetwork;
      this.changeDetectorRef.detectChanges();
    });

    this.translations$ = this.networkSelectorService.getTranslations();
  }

  public switchNetwork(network: Network): void {
    this.networkSelectorService.setActiveNetworkId(network.id);
  }

  public trackByName: TrackByFunction<Network> = ({}, { name }) => name;
}
