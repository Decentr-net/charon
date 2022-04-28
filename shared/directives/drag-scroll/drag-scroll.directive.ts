import { Directive, ElementRef, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, pairwise, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
  selector: '[appDragScroll]',
})
export class DragScrollDirective implements OnInit {
  private defaultCursor: string;

  private dragScrollElement: HTMLElement;

  constructor(
    elementRef: ElementRef<HTMLElement>,
  ) {
    this.dragScrollElement = elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.defaultCursor = this.dragScrollElement.style.cursor;

    fromEvent(this.dragScrollElement, 'mouseover').pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      if (this.dragScrollElement.scrollWidth > this.dragScrollElement.offsetWidth) {
        this.dragScrollElement.style.cursor = 'grabbing';
      }
    });

    fromEvent(this.dragScrollElement, 'mouseleave').pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.dragScrollElement.style.cursor = this.defaultCursor;
    });

    fromEvent(this.dragScrollElement, 'mousedown').pipe(
      switchMap((event: MouseEvent) => fromEvent<MouseEvent>(this.dragScrollElement, 'mousemove').pipe(
        startWith(event),
        map(({ clientX }) => clientX),
        pairwise(),
        takeUntil(fromEvent(this.dragScrollElement, 'mouseup')),
        takeUntil(fromEvent(this.dragScrollElement, 'mouseleave')),
      )),
      untilDestroyed(this),
    ).subscribe(([prevX, currX]) => {
      this.dragScrollElement.scrollLeft = this.dragScrollElement.scrollLeft + prevX - currX;
    });
  }
}
