import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface CircleWallPost {
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
  selector: 'app-circle-wall-post',
  templateUrl: './circle-wall-post.component.html',
  styleUrls: ['./circle-wall-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleWallPostComponent {
  @Input() public post: CircleWallPost;
}
