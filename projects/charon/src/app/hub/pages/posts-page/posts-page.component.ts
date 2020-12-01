import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HubFeedPost } from '../../components/hub-feed-post';
import { HUB_HEADER_CONTENT_SLOT } from '../../components/hub-header';

@Component({
  selector: 'app-posts-page',
  templateUrl: './posts-page.component.html',
  styleUrls: ['./posts-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsPageComponent {
  public headerContentSlotName = HUB_HEADER_CONTENT_SLOT;

  public post: HubFeedPost = {
    author: {
      avatar: 'user-avatar-1',
      name: 'Eugene Tishkevich',
    },
    content: 'Grocery delivery is one of the fastest growing businesses at Amazon and we think this will be one of the most-loved Prime benefits in the UK, says Russell Jones, country manager of Amazon Fresh UK.\n' +
      'He says this expansion was on the cards before Covid-19.',
    pdv: 1.78,
    rating: {
      likes: 2,
      dislikes: 1,
    },
    time: Date.now(),
    title: 'Why is grocery shopping a Covid-19 issue',
  };
}
