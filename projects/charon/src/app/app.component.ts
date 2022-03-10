import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { svgLogoIcon } from '@shared/svg-icons/logo-icon';
import { isOpenedInPopup } from '@shared/utils/browser';
import { APP_VERSION } from '@shared/utils/version';
import { HelpService, ThemeService } from '@core/services';
import { APP_TITLE } from './app.definitions';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @HostBinding('attr.version') public appVersion: string = APP_VERSION;

  @HostBinding('class.mod-popup-view') public isOpenedInPopup = isOpenedInPopup();

  public isInitLoading = true;

  constructor(
    helpService: HelpService,
    svgIconRegistry: SvgIconRegistry,
    titleService: Title,
    themeService: ThemeService,
  ) {
    helpService.initialize();

    themeService.getThemeValue().pipe(
      untilDestroyed(this),
    ).subscribe();

    svgIconRegistry.register([
      svgLogoIcon,
    ]);

    titleService.setTitle(APP_TITLE);
  }
}
