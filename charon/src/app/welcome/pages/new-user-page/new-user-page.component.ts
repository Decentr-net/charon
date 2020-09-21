import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PublicRoute } from '../../../public/public-route';
import { AppRoute } from '../../../app-route';

@Component({
  selector: 'app-new-user-page',
  templateUrl: './new-user-page.component.html',
  styleUrls: ['./new-user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewUserPageComponent {
  public readonly appRoute: typeof AppRoute = AppRoute;
  public readonly publicRoute: typeof PublicRoute = PublicRoute;
}
