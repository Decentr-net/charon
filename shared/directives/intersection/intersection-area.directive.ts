import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appIntersectionArea]',
})
export class IntersectionAreaDirective {
  constructor(private elementRef: ElementRef<HTMLElement>) {
  }

  public get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
