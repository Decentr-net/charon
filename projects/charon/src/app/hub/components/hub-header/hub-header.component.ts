import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { AppRoute } from '../../../app-route';
import { UserRoute } from '../../../user';
import { HubRoute, HubFeedRoute } from '../../hub-route';
import { svgEdit, svgLogo } from '@shared/svg-icons';

export const HUB_HEADER_META_SLOT = Symbol('HUB_HEADER_META_SLOT');
export const HUB_HEADER_CONTENT_SLOT = Symbol('HUB_HEADER_CONTENT_SLOT');

@Component({
  selector: 'app-hub-header',
  templateUrl: './hub-header.component.html',
  styleUrls: ['./hub-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubHeaderComponent {
  @Input() public avatarIcon: string;

  public readonly metaSlotName: Symbol = HUB_HEADER_META_SLOT;
  public readonly contentSlotName: Symbol = HUB_HEADER_CONTENT_SLOT;

  public readonly appRoute: typeof AppRoute = AppRoute;
  public readonly hubRoute: typeof HubRoute = HubRoute;
  public readonly hubFeedRoute: typeof HubFeedRoute = HubFeedRoute;
  public readonly userRoute: typeof UserRoute = UserRoute;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgEdit,
      svgLogo,
    ]);
  }
}
