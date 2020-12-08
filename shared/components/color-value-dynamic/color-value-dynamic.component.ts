import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ColorCircleLabelColor, ColorCircleType } from '../color-circle-label';
import { ColorValueDynamic } from './color-value-dynamic.definition';

@Component({
  selector: 'app-color-value-dynamic',
  templateUrl: './color-value-dynamic.component.html',
  styleUrls: ['./color-value-dynamic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorValueDynamicComponent {
  @Input() public color: ColorCircleLabelColor;
  @Input() public dayMargin: ColorValueDynamic['dayMargin'];
  @Input() public circleType: ColorCircleType;
}
