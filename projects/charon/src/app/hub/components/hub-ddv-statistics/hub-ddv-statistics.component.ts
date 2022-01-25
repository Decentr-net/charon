import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { AdvDdvStatistics } from 'decentr-js';

import { svgPath } from '@shared/svg-icons/path';

@Component({
  selector: 'app-hub-ddv-statistics',
  templateUrl: './hub-ddv-statistics.component.html',
  styleUrls: ['./hub-ddv-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubDdvStatisticsComponent {
  @Input() public statistics: AdvDdvStatistics;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgPath,
    ]);
  }
}
