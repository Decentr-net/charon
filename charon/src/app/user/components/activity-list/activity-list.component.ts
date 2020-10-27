import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { ActivityDetailsComponent } from '../activity-details';
import { MatchMediaService } from '@shared/services/match-media/match-media.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivityItem } from '../../pages/user-page';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityListComponent implements OnInit {

  activityItems: ActivityItem[];

  constructor(
    public dialog: MatDialog,
    public matchMediaService: MatchMediaService,
  ) {
  }

  ngOnInit(): void {
    this.activityItems = [
      { id: 'id1', name: 'Cookies name 1', date: '24.07.2020, 11:50', site: 'google.com' },
      { id: 'id1', name: 'Cookies name 2', date: '24.07.2020, 11:50', site: 'decentr.net' },
      { id: 'id1', name: 'Cookies name 3', date: '24.07.2020, 11:50', site: 'yahoo.com' },
      { id: 'id1', name: 'Cookies name 1', date: '24.07.2020, 11:50', site: 'google.com' },
      { id: 'id1', name: 'Cookies name 2', date: '24.07.2020, 11:50', site: 'decentr.net' },
      { id: 'id1', name: 'Cookies name 3', date: '24.07.2020, 11:50', site: 'yahoo.com' },
      { id: 'id1', name: 'Cookies name 1', date: '24.07.2020, 11:50', site: 'google.com' },
      { id: 'id1', name: 'Cookies name 2', date: '24.07.2020, 11:50', site: 'decentr.net' },
      { id: 'id1', name: 'Cookies name 3', date: '24.07.2020, 11:50', site: 'yahoo.com' },
      { id: 'id1', name: 'Cookies name 1', date: '24.07.2020, 11:50', site: 'google.com' },
      { id: 'id1', name: 'Cookies name 2', date: '24.07.2020, 11:50', site: 'decentr.net' },
      { id: 'id1', name: 'Cookies name 3', date: '24.07.2020, 11:50', site: 'yahoo.com' }
    ];
  }

  openActivityItemDetails(id: string) {
    const config = {
      width: '940px',
      maxWidth: '100%',
      height: '500px',
      maxHeight: '100%',
      panelClass: 'popup-no-padding',
      data: { id }
    };

    if (this.matchMediaService.isSmall()) {
      config['height'] = '100%';
      config['maxHeight'] = '100vh';
    }

    this.dialog.open(ActivityDetailsComponent, config);
  }

  public trackById: TrackByFunction<ActivityItem> = ({}, { id }) => id;
}
