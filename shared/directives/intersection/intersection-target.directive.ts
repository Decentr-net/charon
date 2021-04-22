import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';

import { IntersectionAreaDirective } from './intersection-area.directive';

@Directive({
  selector: '[appIntersectionTarget]',
})
export class IntersectionTargetDirective implements OnInit, OnDestroy {
  @Input('appIntersectionTarget') public threshold: number = 1;

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
        threshold: this.threshold,
      },
    );

    this.intersectionObserver.observe(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.intersectionObserver.disconnect();
  }
}
