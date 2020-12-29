import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Optional, Output } from '@angular/core';

import { IntersectionAreaDirective } from './intersection-area.directive';

@Directive({
  selector: '[appIntersectionTarget]',
})
export class IntersectionTargetDirective implements OnInit, OnDestroy {
  @Output() public intersect: EventEmitter<void> = new EventEmitter();

  private intersectionObserver: IntersectionObserver;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Optional() private intersectionArea: IntersectionAreaDirective,
  ) {
  }

  public ngOnInit(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          this.intersect.emit();
        }
      },
      {
        root: this.intersectionArea?.element,
        threshold: 1,
      },
    );

    this.intersectionObserver.observe(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.intersectionObserver.disconnect();
  }
}
