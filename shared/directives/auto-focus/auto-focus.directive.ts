import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
  @Input('appAutoFocus') public enabled = true;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) {
  }

  public ngAfterViewInit(): void {
    if (!this.enabled) {
      return;
    }

    this.elementRef.nativeElement.focus();
  }
}
