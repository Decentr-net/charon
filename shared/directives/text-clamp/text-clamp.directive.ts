import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { auditTime, startWith } from 'rxjs/operators';
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
    private renderer: Renderer2,
  ) {
  }

  public ngOnInit() {
    const element = this.elementRef.nativeElement;

    observeResize(element)
      .pipe(
        auditTime(300),
        startWith(void 0),
        untilDestroyed(this)
      ).subscribe(() => {
        const height = getComputedStyle(element).height;
        clamp(this.elementRef.nativeElement, { clamp: height });
        this.renderer.setStyle(this.elementRef.nativeElement, 'height', 'min-content');
      });
  }
}
