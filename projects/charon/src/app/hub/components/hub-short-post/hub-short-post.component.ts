import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Post } from 'decentr-js';

@Component({
  selector: 'app-hub-short-post',
  templateUrl: './hub-short-post.component.html',
  styleUrls: ['./hub-short-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubShortPostComponent {
  @Input() public post: Post;
}
