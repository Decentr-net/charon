import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) {
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }
}
