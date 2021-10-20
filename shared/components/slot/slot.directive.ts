import { Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { SlotService } from './slot.service';

@Directive({
  selector: '[appSlot]',
})
export class SlotDirective implements OnInit, OnChanges, OnDestroy {
  @Input('appSlot') public slotName: symbol;

  constructor(
    private slotService: SlotService,
    private templateRef: TemplateRef<{ rootElement: HTMLElement }>,
  ) {
  }

  public ngOnInit(): void {
    this.slotService.registerSlot(this.slotName, this.templateRef);
  }

  public ngOnChanges({ slotName }: SimpleChanges): void {
    if (slotName) {
      this.slotService.registerSlot(slotName.currentValue, this.templateRef);
    }
  }

  public ngOnDestroy(): void {
    this.slotService.unregisterSlot(this.slotName);
  }
}
