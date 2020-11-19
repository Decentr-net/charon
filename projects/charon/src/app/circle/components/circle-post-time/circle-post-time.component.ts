import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-circle-post-time',
  templateUrl: './circle-post-time.component.html',
  styleUrls: ['./circle-post-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePostTimeComponent {
  @Input() time: number;
}
