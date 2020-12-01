import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HubWallRoute } from '../../hub-route';

@Component({
  selector: 'app-hub-wall-navigation',
  templateUrl: './hub-wall-navigation.component.html',
  styleUrls: ['./hub-wall-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubWallNavigationComponent {
  public wallRoute: typeof HubWallRoute = HubWallRoute;
}
