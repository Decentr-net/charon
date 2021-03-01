import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

export type Typeface = 'caption'
  | 'paragraph'
  | 'subheader'
  | 'header-4'
  | 'header-3'
  | 'header-2'
  | 'header-1';

@Directive({
  selector: '[appTypeface]',
})
export class TypefaceDirective implements OnChanges {
  @Input('appTypeface') public typeface: Typeface;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {
  }

  public ngOnChanges({ typeface }: SimpleChanges) {
    if (typeface) {
      this.renderer.removeClass(this.elementRef.nativeElement, `typeface-${typeface.previousValue}`);
      typeface.currentValue && this.renderer.addClass(this.elementRef.nativeElement, `typeface-${typeface.currentValue}`);
    }
  }
}
