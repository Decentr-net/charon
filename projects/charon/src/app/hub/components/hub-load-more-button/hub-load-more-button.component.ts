import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgReload } from '@shared/svg-icons/reload';

@Component({
  selector: 'button[app-hub-load-more-button]',
  templateUrl: './hub-load-more-button.component.html',
  styleUrls: ['./hub-load-more-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubLoadMoreButtonComponent {
  constructor(svgIconRegistry: SvgIconRegistry) {
    svgIconRegistry.register(svgReload);
  }
}
