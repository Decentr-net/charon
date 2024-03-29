import { Directive, ElementRef, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
  selector: '[appMouseWheelHorizontalScroll]',
})
export class MouseWheelHorizontalScrollDirective implements OnInit {
  private mouseWheelHorizontalScrollElement: HTMLElement;

  constructor(
    elementRef: ElementRef<HTMLElement>,
  ) {
    this.mouseWheelHorizontalScrollElement = elementRef.nativeElement;
  }

  ngOnInit(): void {
    fromEvent(this.mouseWheelHorizontalScrollElement, 'wheel').pipe(
      untilDestroyed(this),
    ).subscribe((event: WheelEvent) => {
      this.mouseWheelHorizontalScrollElement.scrollLeft
        = this.mouseWheelHorizontalScrollElement.scrollLeft + event.deltaY * (event.deltaMode ? 30 : 1);
    });
  }
}
