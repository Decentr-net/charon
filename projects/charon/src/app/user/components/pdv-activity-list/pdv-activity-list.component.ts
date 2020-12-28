import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from '@angular/core';
import { PDVType } from 'decentr-js';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgLock } from '@shared/svg-icons';

export interface PDVActivityListItem {
  address: string;
  date: Date;
  type: PDVType;
}

@Component({
  selector: 'app-activity-list',
  templateUrl: './pdv-activity-list.component.html',
  styleUrls: ['./pdv-activity-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdvActivityListComponent {
  public readonly pdvType: typeof PDVType = PDVType;

  @Input() public items: PDVActivityListItem[] = [];

  @Output() public details: EventEmitter<PDVActivityListItem> = new EventEmitter();

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register(svgLock);
  }

  public onItemClick(item: PDVActivityListItem): void {
    this.details.emit(item);
  }

  public trackByAddress: TrackByFunction<PDVActivityListItem> = ({}, { address }) => address;
}
