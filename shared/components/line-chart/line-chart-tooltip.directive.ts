import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appLineChartTooltip]',
})
export class LineChartTooltipDirective<T> {
  constructor(
    private templateRef: TemplateRef<T>,
  ) {
  }
}
