import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgSignal } from '@shared/svg-icons';

@Component({
  selector: 'app-hub-post-pdv',
  templateUrl: './hub-post-pdv.component.html',
  styleUrls: ['./hub-post-pdv.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostPdvComponent {
  @Input() public pdv: number;

  constructor(svgIconRegistry: SvgIconRegistry) {
    svgIconRegistry.register(svgSignal);
  }
}
