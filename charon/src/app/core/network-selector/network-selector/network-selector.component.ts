import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck, share } from 'rxjs/operators';

import { Network, NetworkSelectorService } from '../network-selector.service';

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
    private networkService: NetworkSelectorService,
  ) {
  }

  public ngOnInit() {
    this.networks$ = this.networkService.getNetworks();
    this.activeNetworkName$ = this.networkService.getActiveNetwork().pipe(
      pluck('name'),
      share(),
    );
  }

  public switchNetwork(network: Network): void {
    this.networkService.setActiveNetwork(network);
  }

  public trackByName: TrackByFunction<Network> = ({}, { name }) => name;
}
