import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface HubShortPost {
  author: {
    avatar: string;
    name: string;
  }
  content: string;
  pdv: string;
  time: string;
}

@Component({
  selector: 'app-hub-short-post',
  templateUrl: './hub-short-post.component.html',
  styleUrls: ['./hub-short-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubShortPostComponent {
  @Input() public post: HubShortPost;
}
