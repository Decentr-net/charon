import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgLogo, svgLogoPink } from '@shared/svg-icons';

export const HUB_HEADER_LOGO_SLOT = Symbol('HUB_HEADER_LOGO_SLOT');
export const HUB_HEADER_META_SLOT = Symbol('HUB_HEADER_META_SLOT');
export const HUB_HEADER_CONTENT_SLOT = Symbol('HUB_HEADER_CONTENT_SLOT');
export const HUB_HEADER_ACTIONS_SLOT = Symbol('HUB_HEADER_ACTIONS_SLOT');

@Component({
  selector: 'app-hub-header',
  templateUrl: './hub-header.component.html',
  styleUrls: ['./hub-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubHeaderComponent {
  @Input() public avatarIcon: string;

  public readonly logoSlotName: Symbol = HUB_HEADER_LOGO_SLOT;
  public readonly metaSlotName: Symbol = HUB_HEADER_META_SLOT;
  public readonly contentSlotName: Symbol = HUB_HEADER_CONTENT_SLOT;
  public readonly actionsSlotName: Symbol = HUB_HEADER_ACTIONS_SLOT;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgLogo,
      svgLogoPink,
    ]);
  }
}
