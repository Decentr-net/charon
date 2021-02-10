import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

import { PostWithLike } from '../../models/post';

@Component({
  selector: 'app-hub-post-card',
  templateUrl: './hub-post-card.component.html',
  styleUrls: ['./hub-post-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostCardComponent implements OnChanges {
  @Input() public post: PostWithLike;

  @Input() public orientation: 'horizontal' | 'vertical' = 'vertical';

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ) {
    this.renderer.addClass(this.elementRef, `mod-${this.orientation}`);
  }

  @HostBinding('class.mod-has-preview-image')
  public get hasPreviewImage(): boolean {
    return this.post && !!this.post.previewImage;
  }

  public ngOnChanges({ orientation }: SimpleChanges): void {
    if (orientation) {
      this.renderer.removeClass(this.elementRef, `mod-${orientation.previousValue}`);
      this.renderer.addClass(this.elementRef, `mod-${orientation.currentValue}`);
    }
  }
}
