import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { AdvDdvStatistics } from 'decentr-js';

import { svgPath } from '@shared/svg-icons/path';

@Component({
  selector: 'app-hub-adv-statistics',
  templateUrl: './hub-adv-statistics.component.html',
  styleUrls: ['./hub-adv-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubAdvStatisticsComponent {
  @Input() public statistics: AdvDdvStatistics;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgPath,
    ]);
  }
}
