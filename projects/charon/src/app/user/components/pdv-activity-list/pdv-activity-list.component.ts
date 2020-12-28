import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from '@angular/core';
import { PDVType } from 'decentr-js';

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

  public onItemClick(item: PDVActivityListItem): void {
    this.details.emit(item);
  }

  public trackByAddress: TrackByFunction<PDVActivityListItem> = ({}, { address }) => address;
}
