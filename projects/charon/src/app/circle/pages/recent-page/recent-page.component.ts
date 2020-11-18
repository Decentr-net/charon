import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-recent-page',
  templateUrl: './recent-page.component.html',
  styleUrls: ['./recent-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentPageComponent {
}
