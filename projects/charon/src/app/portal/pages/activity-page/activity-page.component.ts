import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-activity-page',
  templateUrl: './activity-page.component.html',
  styleUrls: ['./activity-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityPageComponent {
}
