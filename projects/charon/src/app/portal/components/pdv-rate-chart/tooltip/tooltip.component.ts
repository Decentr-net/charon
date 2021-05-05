import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';
import { TooltipFormatterContextObject } from 'highcharts';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TooltipComponent {
  public tooltipData: TooltipFormatterContextObject;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  @Input() set data(value: TooltipFormatterContextObject) {
    this.tooltipData = value;
    this.changeDetectorRef.detectChanges();
  }
}
