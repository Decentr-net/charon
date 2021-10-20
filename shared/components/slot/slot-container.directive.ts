import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SlotService, SlotTemplate } from './slot.service';

@UntilDestroy()
@Directive({
  selector: '[appSlotContainer]',
})
export class SlotContainerDirective implements OnInit {
  @Input('appSlotContainer') public forSlot: symbol;
  @Input('appSlotContainerRootElement') public rootElement: HTMLElement;

  constructor(
    private slotService: SlotService,
    private templateRef: TemplateRef<{ rootElement: HTMLElement }>,
    private viewContainerRef: ViewContainerRef,
  ) {
  }

  public ngOnInit(): void {
    this.slotService.getSlotTemplate(this.forSlot)
      .pipe(
        untilDestroyed(this),
      ).subscribe((template) => {
        this.viewContainerRef.clear();

        this.renderTemplate(template || this.templateRef);
      });
  }

  private renderTemplate(template: SlotTemplate): void {
    this.viewContainerRef.createEmbeddedView(template, { rootElement: this.rootElement })
      .detectChanges();
  }
}
