import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HubFeedRoute, HubRoute } from '../../hub-route';
import { AppRoute } from '../../../app-route';

interface LinkDef {
  link: string[];
  i18nKey: string;
}

@Component({
  selector: 'app-hub-feed-navigation',
  templateUrl: './hub-feed-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubFeedNavigationComponent {
  public readonly links: LinkDef[] = [
    {
      i18nKey: 'hub.hub_feed_navigation.following',
      link: ['/', AppRoute.Hub, HubRoute.Feed, HubFeedRoute.Following],
    },
    {
      i18nKey: 'hub.hub_feed_navigation.my_posts',
      link: ['/', AppRoute.Hub, HubRoute.Feed, HubFeedRoute.MyPosts],
    },
  ];
}
