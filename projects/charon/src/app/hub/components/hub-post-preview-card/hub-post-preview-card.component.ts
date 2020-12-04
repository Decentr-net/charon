import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Post } from 'decentr-js';

@Component({
  selector: 'app-hub-post-preview-card',
  templateUrl: './hub-post-preview-card.component.html',
  styleUrls: ['./hub-post-preview-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostPreviewCardComponent {
  @Input() public post: Post;

  @Input() public maxContentLines: number;
}
