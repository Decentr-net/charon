import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { PDVType } from 'decentr-js';

import { pdvTypeIcons } from '../../svg-icons/pdv-type';

const PDV_TYPE_ICON_MAP: Record<PDVType, string> = {
  [PDVType.AdvertiserId]: 'advertiser',
  [PDVType.Cookie]: 'cookie',
  [PDVType.Location]: 'location',
  [PDVType.Profile]: 'profile',
  [PDVType.SearchHistory]: 'search-history',
};

@Component({
  selector: 'app-pdv-type-icon',
  templateUrl: './pdv-type-icon.component.html',
  styleUrls: ['./pdv-type-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdvTypeIconComponent implements OnInit {
  @Input() public type: PDVType;

  constructor(
    private svgIconRegistry: SvgIconRegistry,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register(pdvTypeIcons);
  }

  public get icon(): string {
    return PDV_TYPE_ICON_MAP[this.type];
  }
}
