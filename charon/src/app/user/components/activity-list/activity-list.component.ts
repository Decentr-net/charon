import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from '@angular/core';

export interface ActivityItem {
  address: string;
  date: Date;
}

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityListComponent {
  @Input() public items: ActivityItem[] = [];
  @Output() public details: EventEmitter<ActivityItem['address']> = new EventEmitter();

  public trackByAddress: TrackByFunction<ActivityItem> = ({}, { address }) => address;
}
