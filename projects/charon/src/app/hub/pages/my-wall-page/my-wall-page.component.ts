import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MyWallPageService } from './my-wall-page.service';
import { HubPostsService } from '../../services';

@Component({
  selector: 'app-my-wall-page',
  templateUrl: './my-wall-page.component.html',
  styleUrls: ['./my-wall-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: HubPostsService,
      useClass: MyWallPageService,
    },
  ],
})
export class MyWallPageComponent {
}
