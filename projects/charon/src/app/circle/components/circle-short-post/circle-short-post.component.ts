import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface CircleShortPost {
  author: {
    avatar: string;
    name: string;
  }
  content: string;
  pdv: string;
  time: string;
}

@Component({
  selector: 'app-circle-short-post',
  templateUrl: './circle-short-post.component.html',
  styleUrls: ['./circle-short-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleShortPostComponent {
  @Input() public post: CircleShortPost;
}
