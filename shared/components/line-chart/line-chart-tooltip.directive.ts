import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appLineChartTooltip]',
})
export class LineChartTooltipDirective {
  constructor(
    private templateRef: TemplateRef<{}>,
  ) {
  }
}
