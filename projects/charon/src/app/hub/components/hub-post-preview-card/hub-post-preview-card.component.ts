import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { Post } from 'decentr-js';

@Component({
  selector: 'app-hub-post-preview-card',
  templateUrl: './hub-post-preview-card.component.html',
  styleUrls: ['./hub-post-preview-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostPreviewCardComponent {
  @Input() public post: Post;

  @HostBinding('class.mod-has-preview-image')
  public get hasPreviewImage(): boolean {
    return this.post && !!this.post.previewImage;
  }
}
