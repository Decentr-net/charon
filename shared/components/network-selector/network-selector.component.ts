import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { Network, NetworkSelectorTranslations } from './network-selector.definitions';
import { NetworkSelectorService } from './network-selector.service';

@Component({
  selector: 'app-network-selector',
  templateUrl: './network-selector.component.html',
  styleUrls: ['./network-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkSelectorComponent implements OnInit {
  public activeNetworkName$: Observable<Network['name']>;

  public networks$: Observable<Network[]>;

  public translations$: Observable<NetworkSelectorTranslations>;

  constructor(
    private networkSelectorService: NetworkSelectorService,
  ) {
  }

  public ngOnInit(): void {
    this.networks$ = this.networkSelectorService.getNetworks();

    this.activeNetworkName$ = this.networkSelectorService.getActiveNetwork().pipe(
      pluck('name'),
    );

    this.translations$ = this.networkSelectorService.getTranslations();
  }

  public switchNetwork(network: Network): void {
    this.networkSelectorService.setActiveNetwork(network);
  }

  public trackByName: TrackByFunction<Network> = ({}, { name }) => name;
}
