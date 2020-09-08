import { Component, OnInit } from '@angular/core';

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

  constructor() {
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
    ]
  }
}
