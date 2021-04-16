import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT,
  AUTHORIZED_LAYOUT_HEADER_META_SLOT,
} from '@core/layout/authorized-layout';
import { AppRoute } from '../../../app-route';
import { HubRoute } from '../../hub-route';

@Component({
  selector: 'app-hub-page',
  templateUrl: './hub-page.component.html',
  styleUrls: ['./hub-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPageComponent {
  public headerActionsSlotName = AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT;
  public headerMetaSlotName = AUTHORIZED_LAYOUT_HEADER_META_SLOT;

  public appRoute: typeof AppRoute = AppRoute;
  public hubRoute: typeof HubRoute = HubRoute;
}
