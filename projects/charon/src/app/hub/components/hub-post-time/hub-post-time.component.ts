import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-hub-post-time',
  templateUrl: './hub-post-time.component.html',
  styleUrls: ['./hub-post-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostTimeComponent {
  @Input() time: number;
}
