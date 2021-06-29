import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgArrowLeft } from '../../svg-icons/arrow-left';

@Component({
  selector: 'button[app-button-back]',
  templateUrl: './button-back.component.html',
  styleUrls: ['./button-back.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonBackComponent {
  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgArrowLeft,
    ]);
  }
}
