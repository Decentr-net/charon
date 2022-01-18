import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { svgLogoIcon } from '@shared/svg-icons/logo-icon';
import { APP_VERSION } from '@shared/utils/version';
import { HelpService, ThemeService } from '@core/services';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @HostBinding('attr.version') public appVersion: string = APP_VERSION;

  public isInitLoading = true;

  constructor(
    helpService: HelpService,
    svgIconRegistry: SvgIconRegistry,
    themeService: ThemeService,
  ) {
    helpService.initialize();

    themeService.getThemeValue().pipe(
      untilDestroyed(this),
    ).subscribe();

    svgIconRegistry.register([
      svgLogoIcon,
    ]);
  }
}
