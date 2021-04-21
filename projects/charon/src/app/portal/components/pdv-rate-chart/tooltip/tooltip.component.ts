import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TooltipFormatterContextObject } from 'highcharts';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TooltipComponent {
  @Input() data!: TooltipFormatterContextObject;
}
