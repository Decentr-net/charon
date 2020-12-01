import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HubFeedPost } from '../../components/hub-feed-post';

@Component({
  selector: 'app-feed-page',
  templateUrl: './feed-page.component.html',
  styleUrls: ['./feed-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedPageComponent {
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
