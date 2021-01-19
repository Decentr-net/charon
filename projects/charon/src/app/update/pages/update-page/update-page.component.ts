import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { svgLogoIcon } from '@shared/svg-icons';

@Component({
  selector: 'app-update-page',
  templateUrl: './update-page.component.html',
  styleUrls: ['./update-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePageComponent {
  constructor(svgIconRegistry: SvgIconRegistry) {
    svgIconRegistry.register(svgLogoIcon);
  }
}
