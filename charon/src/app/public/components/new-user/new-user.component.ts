import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PublicRoute } from '../../public-route';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewUserComponent {
  public readonly publicRoute: typeof PublicRoute = PublicRoute;
}
