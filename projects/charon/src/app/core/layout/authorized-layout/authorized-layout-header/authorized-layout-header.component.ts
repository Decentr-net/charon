import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, OnInit } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgLogo } from '@shared/svg-icons';
import { isOpenedInTab } from '@shared/utils/browser';

export const AUTHORIZED_LAYOUT_HEADER_LOGO_SLOT = Symbol('AUTHORIZED_LAYOUT_HEADER_LOGO_SLOT');
export const AUTHORIZED_LAYOUT_HEADER_META_SLOT = Symbol('AUTHORIZED_LAYOUT_HEADER_META_SLOT');
export const AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT = Symbol('AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT');

@Component({
  selector: 'app-authorized-layout-header',
  templateUrl: './authorized-layout-header.component.html',
  styleUrls: ['./authorized-layout-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedLayoutHeaderComponent implements OnInit {
  @HostBinding('class.mod-popup-view') public isOpenedInPopup: boolean;

  public readonly logoSlotName: Symbol = AUTHORIZED_LAYOUT_HEADER_LOGO_SLOT;
  public readonly metaSlotName: Symbol = AUTHORIZED_LAYOUT_HEADER_META_SLOT;
  public readonly actionsSlotName: Symbol = AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT;

  constructor(
    public elementRef: ElementRef<HTMLElement>,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgLogo,
    ]);
  }

  public ngOnInit(): void {
    this.isOpenedInPopup = !isOpenedInTab();
  }
}
