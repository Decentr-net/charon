import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

import { RecentPageService } from './recent-page.service';
import { HubPostsService } from '../../services';

@UntilDestroy()
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
