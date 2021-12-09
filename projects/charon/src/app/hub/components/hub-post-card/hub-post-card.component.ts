import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { PostsListItem } from '@core/services';
import { svgLink } from '@shared/svg-icons/link';
import { svgTrash } from '@shared/svg-icons/trash';

const DEFAULT_ORIENTATION = 'vertical';

@Component({
  selector: 'app-hub-post-card',
  templateUrl: './hub-post-card.component.html',
  styleUrls: ['./hub-post-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostCardComponent implements OnChanges, OnInit {
  @Input() public post: PostsListItem;

  @Input() public orientation: 'horizontal' | 'vertical';

  @Input() public includeVerticalImagePadding: boolean = false;

  @Input() public disableCategory: boolean = false;

  public imgSrc: string;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    svgIconRegistry: SvgIconRegistry,
  ) {
    this.renderer.addClass(this.elementRef.nativeElement, `mod-${DEFAULT_ORIENTATION}`);

    svgIconRegistry.register([
      svgLink,
      svgTrash,
    ]);
  }

  public ngOnInit(): void {
    this.imgSrc = `${this.post.previewImage}/thumb`;
  }

  public ngOnChanges({ orientation }: SimpleChanges): void {
    if (orientation) {
      if (orientation.firstChange) {
        this.renderer.removeClass(this.elementRef.nativeElement, `mod-${DEFAULT_ORIENTATION}`);
      }

      this.renderer.removeClass(this.elementRef.nativeElement, `mod-${orientation.previousValue}`);
      this.renderer.addClass(this.elementRef.nativeElement, `mod-${orientation.currentValue}`);
    }
  }

  public onLinkClick(event: Event): void {
    event.stopPropagation();
  }
}
