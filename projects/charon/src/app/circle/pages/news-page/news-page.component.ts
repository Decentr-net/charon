import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CircleWallPost } from '../../components/circle-wall-post';

@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsPageComponent {
  public post: CircleWallPost = {
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
