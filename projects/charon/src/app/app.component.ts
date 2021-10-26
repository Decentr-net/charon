import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import packageSettings from '../../../../package.json';

import { svgLogoIcon } from '@shared/svg-icons/logo-icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @HostBinding('attr.version') public appVersion: string = packageSettings.version;

  public isInitLoading = true;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgLogoIcon,
    ]);
  }
}
