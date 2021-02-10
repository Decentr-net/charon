import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

import { PostWithLike } from '../../models/post';

const DEFAULT_ORIENTATION = 'vertical';

@Component({
  selector: 'app-hub-post-card',
  templateUrl: './hub-post-card.component.html',
  styleUrls: ['./hub-post-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostCardComponent implements OnChanges {
  @Input() public post: PostWithLike;

  @Input() public orientation: 'horizontal' | 'vertical';

  @Input() public disableCategory: boolean = false

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ) {
    this.renderer.addClass(this.elementRef.nativeElement, `mod-${DEFAULT_ORIENTATION}`);
  }

  public ngOnChanges({ orientation }: SimpleChanges): void {
    if (orientation) {
      orientation.firstChange && this.renderer.removeClass(this.elementRef.nativeElement, `mod-${DEFAULT_ORIENTATION}`);

      this.renderer.removeClass(this.elementRef.nativeElement, `mod-${orientation.previousValue}`);
      this.renderer.addClass(this.elementRef.nativeElement, `mod-${orientation.currentValue}`);
    }
  }
}
