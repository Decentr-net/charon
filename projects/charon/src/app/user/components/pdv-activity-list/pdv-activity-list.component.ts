import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from '@angular/core';

export interface PDVActivityListItem {
  id: number;
  date: Date;
}

@Component({
  selector: 'app-activity-list',
  templateUrl: './pdv-activity-list.component.html',
  styleUrls: ['./pdv-activity-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdvActivityListComponent {
  @Input() public items: PDVActivityListItem[] = [];

  @Output() public details: EventEmitter<PDVActivityListItem> = new EventEmitter();

  public onItemClick(item: PDVActivityListItem): void {
    this.details.emit(item);
  }

  public trackByAddress: TrackByFunction<PDVActivityListItem> = ({}, { id }) => id;
}
