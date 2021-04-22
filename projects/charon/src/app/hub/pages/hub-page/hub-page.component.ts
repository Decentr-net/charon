import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AUTHORIZED_LAYOUT_HEADER_META_SLOT } from '@core/layout/authorized-layout';

@Component({
  selector: 'app-hub-page',
  templateUrl: './hub-page.component.html',
  styleUrls: ['./hub-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPageComponent {
  public headerMetaSlotName = AUTHORIZED_LAYOUT_HEADER_META_SLOT;
}
