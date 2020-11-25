import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppRoute as CharonAppRoute } from '@charon/app-route';
import { UserRoute as CharonUserRoute } from '@charon/user';
import {
  CircleRoute as CharonCircleRoute,
  CircleWallRoute as CharonCircleWallRoute,
} from '@charon/circle';
import { openCharonPage } from './utils/extension';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public close(): void {
  }

  public openCharonNews(): void {
    openCharonPage([
      CharonAppRoute.User,
      CharonCircleRoute.News,
      CharonCircleRoute.World,
      CharonCircleWallRoute.Recent,
    ]);
  }

  public openCharonSettings(): void {
    openCharonPage([
      CharonAppRoute.User,
      CharonUserRoute.Edit,
    ]);
  }
}
