import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck, share } from 'rxjs/operators';

import { NetworkSelectorStoreService } from './network-selector-store.service';
import { Network } from './network-selector.definitions';

@Component({
  selector: 'app-network-selector',
  templateUrl: './network-selector.component.html',
  styleUrls: ['./network-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkSelectorComponent implements OnInit {
  public activeNetworkName$: Observable<Network['name']>;
  public networks$: Observable<Network[]>;

  constructor(
    private networkSelectorStoreService: NetworkSelectorStoreService,
  ) {
  }

  public ngOnInit() {
    this.networks$ = this.networkSelectorStoreService.getNetworks();
    this.activeNetworkName$ = this.networkSelectorStoreService.getActiveNetwork().pipe(
      pluck('name'),
      share(),
    );
  }

  public switchNetwork(network: Network): void {
    this.networkSelectorStoreService.setActiveNetwork(network);
  }

  public trackByName: TrackByFunction<Network> = ({}, { name }) => name;
}
