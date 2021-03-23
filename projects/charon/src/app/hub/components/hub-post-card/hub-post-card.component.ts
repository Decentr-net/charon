import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgTrash } from '@shared/svg-icons';
import { PostsListItem } from '@core/services';

const DEFAULT_ORIENTATION = 'vertical';

@Component({
  selector: 'app-hub-post-card',
  templateUrl: './hub-post-card.component.html',
  styleUrls: ['./hub-post-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostCardComponent implements OnChanges {
  @Input() public post: PostsListItem;

  @Input() public orientation: 'horizontal' | 'vertical';

  @Input() public includeVerticalImagePadding: boolean = false;

  @Input() public disableCategory: boolean = false

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    svgIconRegistry: SvgIconRegistry,
  ) {
    this.renderer.addClass(this.elementRef.nativeElement, `mod-${DEFAULT_ORIENTATION}`);

    svgIconRegistry.register(svgTrash);
  }

  public ngOnChanges({ orientation }: SimpleChanges): void {
    if (orientation) {
      orientation.firstChange && this.renderer.removeClass(this.elementRef.nativeElement, `mod-${DEFAULT_ORIENTATION}`);

      this.renderer.removeClass(this.elementRef.nativeElement, `mod-${orientation.previousValue}`);
      this.renderer.addClass(this.elementRef.nativeElement, `mod-${orientation.currentValue}`);
    }
  }
}
