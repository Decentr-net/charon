import { Directive, ElementRef, OnInit } from '@angular/core';
import { auditTime, distinctUntilChanged } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import clamp from 'clamp-js';

import { observeResize } from '../../utils/observe-resize';

@UntilDestroy()
@Directive({
  selector: '[appTextClamp]'
})
export class TextClampDirective implements OnInit {
  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) {
  }

  public ngOnInit() {
    const element = this.elementRef.nativeElement;

    observeResize(element)
      .pipe(
        auditTime(100),
        distinctUntilChanged((prev, curr) => prev.height === curr.height),
        untilDestroyed(this)
      ).subscribe(() => {
        clamp(element, { clamp: 'auto' });
      });
  }
}
