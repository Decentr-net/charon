import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TrackByFunction,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgCheck, svgDropdownExpand } from '@shared/svg-icons';
import { VPNServer } from '@shared/services/configuration';

@Component({
  selector: 'app-vpn-selector',
  templateUrl: './vpn-selector.component.html',
  styleUrls: ['./vpn-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: VpnSelectorComponent,
      multi: true,
    },
  ],
})
export class VpnSelectorComponent extends ControlValueAccessor<VPNServer> implements OnChanges {
  @Input() public servers: VPNServer[];

  public activeServer: VPNServer;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private svgIconRegistry: SvgIconRegistry,
  ) {
    super();

    svgIconRegistry.register([
      svgCheck,
      svgDropdownExpand,
    ]);
  }

  public ngOnChanges({ servers }: SimpleChanges) {
    if (servers) {
      const serversValue = (servers.currentValue || []) as VPNServer[];

      const newServer = serversValue.find((server) => server.address === this.activeServer?.address);

      this.chooseServer(newServer || serversValue[0]);
    }
  }

  public chooseServer(server: VPNServer, emit: boolean = true): void {
    this.activeServer = server;

    emit && this.onChange(this.activeServer);
  }

  public trackByHost: TrackByFunction<VPNServer> = ({}, { address }) => address;

  public writeValue(value: VPNServer) {
    const server = (this.servers || []).find((server) => server.address === value.address);

    this.chooseServer(server || this.servers[0], !server);

    this.changeDetectorRef.markForCheck();
  }
}
