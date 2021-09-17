import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgLogoIcon } from '@shared/svg-icons/logo-icon';
import { svgNewUser } from '@shared/svg-icons/new-user';
import { svgSeedPhrase } from '@shared/svg-icons/seed-phrase';
import { LoginRoute } from '../../../login';
import { AppRoute } from '../../../app-route';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {
  public readonly appRoute: typeof AppRoute = AppRoute;
  public readonly loginRoute: typeof LoginRoute = LoginRoute;

  constructor(svgIconRegistry: SvgIconRegistry) {
    svgIconRegistry.register([
      svgLogoIcon,
      svgNewUser,
      svgSeedPhrase,
    ]);
  }
}
