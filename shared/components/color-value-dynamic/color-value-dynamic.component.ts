import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-color-value-dynamic',
  templateUrl: './color-value-dynamic.component.html',
  styleUrls: ['./color-value-dynamic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorValueDynamicComponent {
  @Input() public dayMargin: number;
  @Input() public dayMarginDigitsInfo: string;
}
