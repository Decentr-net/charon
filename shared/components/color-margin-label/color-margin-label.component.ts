import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { ColorValueDynamic } from '../color-value-dynamic';

@Component({
  selector: 'app-color-margin-label',
  templateUrl: './color-margin-label.component.html',
  styleUrls: ['./color-margin-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorMarginLabelComponent {
  @Input() public dayMargin: ColorValueDynamic['dayMargin'];

  @HostBinding('class.mod-negative')
  public get isNegative(): boolean {
    return this.dayMargin < 0;
  }

  @HostBinding('class.mod-positive')
  public get isPositive(): boolean {
    return this.dayMargin > 0;
  }
}
