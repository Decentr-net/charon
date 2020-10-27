import { ActivityDetailsComponent } from './activity-details';
import { ChartComponent } from './chart';
import { UserLayoutComponent } from './user-layout';
import { ActivityListComponent } from './activity-list/activity-list.component';

export * from './activity-details';
export * from './chart';
export * from './user-layout';

export const USER_COMPONENTS = [
  ActivityDetailsComponent,
  ActivityListComponent,
  ChartComponent,
  UserLayoutComponent,
];
