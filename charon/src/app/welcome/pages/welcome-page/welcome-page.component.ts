import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WelcomeRoute } from '../../welcome-route';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {
  public readonly welcomeRoute: typeof WelcomeRoute = WelcomeRoute;
}
