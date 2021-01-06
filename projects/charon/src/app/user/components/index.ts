import { PdvActivityChartComponent } from './pdv-activity-chart';
import { PdvActivityListComponent } from './pdv-activity-list';
import { PdvDetailsDialogComponent } from './pdv-details-dialog';
import { ToolbarToggleComponent } from './toolbar-toggle';
import { UserLayoutComponent } from './user-layout';
import { AssetsListComponent } from './assets-list';

export * from './pdv-activity-chart';
export * from './pdv-activity-list';
export * from './pdv-details-dialog';
export * from './toolbar-toggle';
export * from './user-layout';

export const USER_COMPONENTS = [
  AssetsListComponent,
  PdvActivityChartComponent,
  PdvActivityListComponent,
  PdvDetailsDialogComponent,
  ToolbarToggleComponent,
  UserLayoutComponent,
];
