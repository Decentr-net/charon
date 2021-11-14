import { ComponentRef, Directive, ElementRef, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { TooltipComponent } from './tooltip.component';

@UntilDestroy()
@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective implements OnInit, OnDestroy {
  @Input('appTooltip') public text = '';

  private overlayRef: OverlayRef;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private viewContainerRef: ViewContainerRef,
  ) {
  }

  public ngOnInit(): void {
    fromEvent(this.elementRef.nativeElement, 'mouseenter').pipe(
      filter(() => !this.overlayRef && !!this.text),
      untilDestroyed(this),
    ).subscribe(() => {
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions([
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: 4,
          },
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -4,
          },
        ]);

      this.overlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
      });

      const tooltipRef: ComponentRef<TooltipComponent> = this.overlayRef.attach(new ComponentPortal(TooltipComponent, this.viewContainerRef));
      tooltipRef.instance.text = this.text;
      tooltipRef.changeDetectorRef.detectChanges();
    });

    fromEvent(this.elementRef.nativeElement, 'mouseleave').pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.hide();
    });
  }

  public ngOnDestroy(): void {
    this.hide();
  }

  private hide(): void {
    if (!this.overlayRef) {
      return;
    }

    this.overlayRef.dispose();
    this.overlayRef = undefined;
  }
}
