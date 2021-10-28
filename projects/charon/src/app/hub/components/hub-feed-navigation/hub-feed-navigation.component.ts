import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HubFeedRoute, HubRoute } from '../../hub-route';
import { AppRoute } from '../../../app-route';

interface LinkDef {
  colorClass: string;
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
      colorClass: 'color-primary',
      i18nKey: 'hub.hub_feed_navigation.following',
      link: ['/', AppRoute.Hub, HubRoute.Feed, HubFeedRoute.Following],
    },
    {
      colorClass: 'color-primary',
      i18nKey: 'hub.hub_feed_navigation.my_posts',
      link: ['/', AppRoute.Hub, HubRoute.Feed, HubFeedRoute.MyPosts],
    },
  ];
}
