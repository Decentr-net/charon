import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AppRoute } from '../../../app-route';
import { UserRoute } from '../../../user';
import { CircleRoute, CircleWallRoute } from '../../circle-route';

export const CIRCLE_HEADER_META_SLOT = Symbol('CIRCLE_HEADER_META_SLOT');
export const CIRCLE_HEADER_CONTENT_SLOT = Symbol('CIRCLE_HEADER_CONTENT_SLOT');

@Component({
  selector: 'app-circle-header',
  templateUrl: './circle-header.component.html',
  styleUrls: ['./circle-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleHeaderComponent {
  @Input() public avatarIcon: string;

  public readonly metaSlotName: Symbol = CIRCLE_HEADER_META_SLOT;
  public readonly contentSlotName: Symbol = CIRCLE_HEADER_CONTENT_SLOT;

  public readonly appRoute: typeof AppRoute = AppRoute;
  public readonly circleRoute: typeof CircleRoute = CircleRoute;
  public readonly circleWallRoute: typeof CircleWallRoute = CircleWallRoute;
  public readonly userRoute: typeof UserRoute = UserRoute;
}
