import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PublicRoute } from '../../public-route';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent {
  public readonly publicRoute: typeof PublicRoute = PublicRoute;
}
