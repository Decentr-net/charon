import { ChangeDetectionStrategy, Component, HostBinding, Input, } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgPdvRateIcon } from '../../svg-icons/pdv-rate-icon';

@Component({
  selector: 'app-pdv-rate-margin-icon',
  templateUrl: './pdv-rate-margin-icon.component.html',
  styleUrls: ['./pdv-rate-margin-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdvRateMarginIconComponent {
  @Input() public rateMargin: number;

  constructor(svgIconRegistry: SvgIconRegistry) {
    svgIconRegistry.register([
      svgPdvRateIcon,
    ]);
  }

  @HostBinding('class.mod-negative')
  public get isNegative(): boolean {
    return this.rateMargin < 0;
  }

  @HostBinding('class.mod-positive')
  public get isPositive(): boolean {
    return this.rateMargin > 0;
  }

  @HostBinding('class.mod-neutral')
  public get isNeutral(): boolean {
    return this.rateMargin === 0;
  }
}
