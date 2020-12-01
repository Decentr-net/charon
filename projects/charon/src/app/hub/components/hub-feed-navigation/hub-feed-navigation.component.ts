import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HubFeedRoute } from '../../hub-route';

@Component({
  selector: 'app-hub-feed-navigation',
  templateUrl: './hub-feed-navigation.component.html',
  styleUrls: ['./hub-feed-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubFeedNavigationComponent {
  public feedRoute: typeof HubFeedRoute = HubFeedRoute;
}
