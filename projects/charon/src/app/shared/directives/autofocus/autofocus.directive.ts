import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef<HTMLElement>) {
  }

  public ngAfterViewInit() {
    this.elementRef.nativeElement.focus();
  }
}
