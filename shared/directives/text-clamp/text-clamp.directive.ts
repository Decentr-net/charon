import { Directive, ElementRef, OnInit } from '@angular/core';
import { auditTime, startWith } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import clamp from 'clamp-js';

import { observeResize } from '../../utils/observe-resize';

@UntilDestroy()
@Directive({
  selector: '[appTextClamp]'
})
export class TextClampDirective implements OnInit {
  constructor(private elementRef: ElementRef<HTMLElement>) {
  }

  public ngOnInit() {
    const element = this.elementRef.nativeElement;

    observeResize(element)
      .pipe(
        auditTime(300),
        startWith(null),
        untilDestroyed(this)
      ).subscribe(() => {
        const oldHeight = element.style.height;
        element.style.height = '100%';
        const height = getComputedStyle(element).height;
        clamp(this.elementRef.nativeElement, {clamp: height});
        element.style.height = oldHeight;
      });
  }
}
