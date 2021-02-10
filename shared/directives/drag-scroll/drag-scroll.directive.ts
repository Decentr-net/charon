import { Directive, ElementRef, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
  selector: '[appDragScroll]',
})
export class DragScrollDirective implements OnInit {
  private isMovable: boolean;
  private lastEvent: MouseEvent;
  private dragScrollElement: HTMLElement;

  constructor(
    private elementRef: ElementRef,
  ) {
    this.dragScrollElement = elementRef.nativeElement;
  }

  ngOnInit(): void {
    fromEvent(this.dragScrollElement, 'mouseover').pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.dragScrollElement.style.cursor = 'grabbing';
    });

    fromEvent(this.dragScrollElement, 'mouseleave').pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.isMovable = false;
      this.dragScrollElement.style.cursor = 'default';
    });

    fromEvent(this.dragScrollElement, 'mouseup').pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.isMovable = false;
    });

    fromEvent(this.dragScrollElement, 'mousedown').pipe(
      untilDestroyed(this),
    ).subscribe((event: MouseEvent) => {
      this.onMouseDown(event);
    });

    fromEvent(this.dragScrollElement, 'mousemove').pipe(
      untilDestroyed(this),
    ).subscribe((event: MouseEvent) => {
      this.onMouseMove(event);
    });
  }

  public onMouseDown(event: MouseEvent): void {
    this.isMovable = true;
    this.lastEvent = event;
  }

  public onMouseMove(event: MouseEvent): void {
    if (this.isMovable) {
      this.dragScrollElement.scrollLeft = this.dragScrollElement.scrollLeft + this.lastEvent.clientX - event.clientX;
      this.lastEvent = event;
    }
  }
}
