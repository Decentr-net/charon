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
import { ProxyServer } from '@core/services';

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
export class VpnSelectorComponent extends ControlValueAccessor<string> implements OnChanges {
  @Input() public servers: ProxyServer[];

  public activeServer: ProxyServer;

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
      const serversValue = (servers.currentValue || []) as ProxyServer[];

      const newServer = serversValue.find((server) => server.host === this.activeServer?.host);

      this.chooseServer(newServer || serversValue[0]);
    }
  }

  public chooseServer(server: ProxyServer, emit: boolean = true): void {
    this.activeServer = server;

    emit && this.onChange(this.activeServer?.host);
  }

  public trackByHost: TrackByFunction<ProxyServer> = ({}, { host }) => host;

  public writeValue(value: string) {
    const server = (this.servers || []).find((server) => server.host === value);

    this.chooseServer(server || this.servers[0], !server);

    this.changeDetectorRef.markForCheck();
  }
}
