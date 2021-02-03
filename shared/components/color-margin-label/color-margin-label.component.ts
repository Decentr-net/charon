import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgMarginNegative, svgMarginNeutral, svgMarginPositive } from '../../svg-icons';

@Component({
  selector: 'app-color-margin-label',
  templateUrl: './color-margin-label.component.html',
  styleUrls: ['./color-margin-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorMarginLabelComponent {
  @Input() public dayMargin: number;
  @Input() public digitsInfo: string;

  @HostBinding('class.mod-negative')
  public get isNegative(): boolean {
    return this.dayMargin < 0;
  }

  @HostBinding('class.mod-neutral')
  public get isNeutral(): boolean {
    return this.dayMargin === 0;
  }

  @HostBinding('class.mod-positive')
  public get isPositive(): boolean {
    return this.dayMargin > 0;
  }

  public marginIcon: 'margin-negative' | 'margin-positive' | 'margin-neutral';

  constructor(svgIconRegistry: SvgIconRegistry) {
    svgIconRegistry.register([
      svgMarginNegative,
      svgMarginNeutral,
      svgMarginPositive,
    ]);
  }

  ngOnInit(): void {
    this.marginIcon = this.isNegative
      ? 'margin-negative' : this.isPositive
        ? 'margin-positive' : 'margin-neutral';
  }
}
