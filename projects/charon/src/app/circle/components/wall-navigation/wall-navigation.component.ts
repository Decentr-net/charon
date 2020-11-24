import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CircleWallRoute } from '../../circle-route';

@Component({
  selector: 'app-wall-navigation',
  templateUrl: './wall-navigation.component.html',
  styleUrls: ['./wall-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WallNavigationComponent {
  public wallRoute: typeof CircleWallRoute = CircleWallRoute;
}
