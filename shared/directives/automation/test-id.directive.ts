import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTestId]'
})
export class TestIdDirective {
  @Input('appTestId') public set testId(value: string) {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'data-testId', value);
  }

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {
  }
}
