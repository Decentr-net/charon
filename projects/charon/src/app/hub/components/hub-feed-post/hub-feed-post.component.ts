import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Post } from 'decentr-js';

@Component({
  selector: 'app-hub-feed-post',
  templateUrl: './hub-feed-post.component.html',
  styleUrls: ['./hub-feed-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubFeedPostComponent {
  @Input() public post: Post;
}
