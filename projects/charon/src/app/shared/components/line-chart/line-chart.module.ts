import { NgModule } from '@angular/core';
import { LineChartComponent } from './line-chart.component';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  imports: [
    CommonModule,
    TranslocoModule
  ],
  declarations: [
    LineChartComponent
  ],
  exports: [
    LineChartComponent
  ],
})
export class LineChartModule {
}
