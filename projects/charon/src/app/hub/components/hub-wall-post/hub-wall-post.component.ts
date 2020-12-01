import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface HubWallPost {
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
  selector: 'app-hub-wall-post',
  templateUrl: './hub-wall-post.component.html',
  styleUrls: ['./hub-wall-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubWallPostComponent {
  @Input() public post: HubWallPost;
}
