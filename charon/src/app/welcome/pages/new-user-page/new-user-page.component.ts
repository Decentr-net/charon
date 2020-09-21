import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoute } from '../../../app-route';
import { LoginRoute } from '../../../login/login-route';

@Component({
  selector: 'app-new-user-page',
  templateUrl: './new-user-page.component.html',
  styleUrls: ['./new-user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewUserPageComponent {
  public readonly appRoute: typeof AppRoute = AppRoute;
  public readonly loginRoute: typeof LoginRoute = LoginRoute;
}
