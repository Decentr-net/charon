import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  TrackByFunction,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgCheck } from '@shared/svg-icons/check';
import { svgDropdownExpand } from '@shared/svg-icons/dropdown-expand';
import { VPNServer } from '@shared/services/configuration';
import { flagsIcons } from '@shared/svg-icons/flags';

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
export class VpnSelectorComponent extends ControlValueAccessor<VPNServer> {
  @Input() public servers: VPNServer[];

  public activeServer: VPNServer;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    svgIconRegistry: SvgIconRegistry,
  ) {
    super();

    svgIconRegistry.register([
      svgCheck,
      svgDropdownExpand,
      ...flagsIcons,
    ]);
  }

  public chooseServer(server: VPNServer, emit: boolean = true): void {
    this.activeServer = server;

    emit && this.onChange(this.activeServer);
  }

  public trackByHost: TrackByFunction<VPNServer> = ({}, { address }) => address;

  public writeValue(server: VPNServer) {
    this.chooseServer(server, false);

    this.changeDetectorRef.markForCheck();
  }
}
