import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TooltipFormatterContextObject } from 'highcharts';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent {
  @Input() data!: TooltipFormatterContextObject;
}
