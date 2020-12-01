import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface HubFeedPost {
  author: {
    avatar: string;
    name: string;
  };
  content: string;
  pdv: number;
  rating: {
    dislikes: number;
    likes: number;
  }
  time: number;
  title: string;
}

@Component({
  selector: 'app-hub-feed-post',
  templateUrl: './hub-feed-post.component.html',
  styleUrls: ['./hub-feed-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubFeedPostComponent {
  @Input() public post: HubFeedPost;
}
