import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { LineChartComponent } from './line-chart.component';
import { LineChartTooltipDirective } from './line-chart-tooltip.directive';

export interface ChartPoint {
  date: number;
  value: number;
}

@NgModule({
  imports: [
    CommonModule,
    TranslocoModule,
  ],
  declarations: [
    LineChartComponent,
    LineChartTooltipDirective,
  ],
  exports: [
    LineChartComponent,
    LineChartTooltipDirective,
  ],
})
export class LineChartModule {
}
