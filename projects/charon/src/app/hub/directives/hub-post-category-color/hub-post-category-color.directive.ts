import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { PostCategory } from 'decentr-js';

@Directive({
  selector: '[appHubPostCategoryColor]',
})
export class HubPostCategoryColorDirective implements OnChanges {
  @Input('appHubPostCategoryColor') public category: PostCategory;

  constructor(
    private elementRef: ElementRef,
    private renderer2: Renderer2,
  ) {
  }

  public static getColorClass(category: PostCategory): string {
    return `post-category-${category}`;
  }

  public ngOnChanges({ category }: SimpleChanges): void {
    if (category) {
      this.renderer2.removeClass(
        this.elementRef.nativeElement,
        HubPostCategoryColorDirective.getColorClass(category.previousValue),
      );

      this.renderer2.addClass(
        this.elementRef.nativeElement,
        HubPostCategoryColorDirective.getColorClass(category.currentValue),
      );
    }
  }
}
