import { Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SlotService } from './slot.service';

@UntilDestroy()
@Directive({
  selector: '[appSlotContainer]',
})
export class SlotContainerDirective implements OnInit {
  @Input('appSlotContainer') public forSlot: symbol;
  @Input('appSlotContainerRootElement') public rootElement: HTMLElement;

  constructor(
    private slotService: SlotService,
    private viewContainerRef: ViewContainerRef,
  ) {
  }

  public ngOnInit() {
    this.slotService.getSlotTemplate(this.forSlot)
      .pipe(
        untilDestroyed(this),
      ).subscribe((template) => {
        if (!template) {
          this.viewContainerRef.clear();
          return;
        }

        this.viewContainerRef.createEmbeddedView(template, { rootElement: this.rootElement })
          .detectChanges();
      });
  }
}
