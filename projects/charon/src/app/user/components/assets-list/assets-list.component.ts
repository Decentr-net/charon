import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgDecentrHub } from '@shared/svg-icons';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsListComponent {
  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register(svgDecentrHub);
  }
}
