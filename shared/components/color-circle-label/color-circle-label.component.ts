import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type ColorCircleLabelColor = 'blue' | 'green' | 'yellow';

@Component({
  selector: 'app-color-circle-label',
  templateUrl: './color-circle-label.component.html',
  styleUrls: ['./color-circle-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorCircleLabelComponent {
  @Input() public color: ColorCircleLabelColor;

  @Input() public circleType: 'filled' | 'hole' = 'filled';

  public get circleClasses(): string {
    return `mod-${this.color} mod-${this.circleType}`;
  }
}
