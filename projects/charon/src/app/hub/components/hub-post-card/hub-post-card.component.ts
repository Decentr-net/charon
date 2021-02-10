import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { PostWithLike } from '../../models/post';

@Component({
  selector: 'app-hub-post-card',
  templateUrl: './hub-post-card.component.html',
  styleUrls: ['./hub-post-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostCardComponent {
  @Input() public post: PostWithLike;

  @Input() public orientation: 'horizontal' | 'vertical' = 'vertical';

  @HostBinding('class.mod-has-preview-image')
  public get hasPreviewImage(): boolean {
    return this.post && !!this.post.previewImage;
  }

  @HostBinding('class.mod-horizontal')
  public
}
