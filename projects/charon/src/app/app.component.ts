import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgLogoIcon } from '@shared/svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public isInitLoading = true;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgLogoIcon,
    ]);
  }
}
