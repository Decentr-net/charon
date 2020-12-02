import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RecentPageService } from './recent-page.service';
import { HubPostsService } from '../../services';

@Component({
  selector: 'app-recent-page',
  templateUrl: './recent-page.component.html',
  styleUrls: ['./recent-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: HubPostsService,
      useClass: RecentPageService,
    },
  ],
})
export class RecentPageComponent {
}
