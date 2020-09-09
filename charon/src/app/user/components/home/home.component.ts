import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { MatchMediaService } from '../../../shared/services/match-media/match-media.service';

export interface ActivityItem {
  id: string;
  name: string;
  date: string;
  site: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  activityItems: ActivityItem[];

  constructor(public dialog: MatDialog,
              private matchMediaService: MatchMediaService) {
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
      width: '536px',
      maxWidth: '100%',
      panelClass: 'popup-no-padding',
      data: { id }
    };

    if (this.matchMediaService.isSmall()) {
      config['height'] = '100%';
      config['maxHeight'] = '100vh';
    }

    this.dialog.open(ActivityDetailsComponent, config);
  }
}
