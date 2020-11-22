import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-color-label',
  templateUrl: './color-label.component.html',
  styleUrls: ['./color-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorLabelComponent {
  @Input() public color: string;
}
