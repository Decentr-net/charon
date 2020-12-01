import { HubPageComponent } from './hub-page';
import { MyWallPageComponent } from './my-wall-page';
import { NewsPageComponent } from './news-page';
import { OverviewPageComponent } from './overview-page';
import { RecentPageComponent } from './recent-page';

export * from './hub-page';
export * from './my-wall-page';
export * from './news-page';
export * from './overview-page';
export * from './recent-page';

export const HUB_PAGES = [
  HubPageComponent,
  MyWallPageComponent,
  NewsPageComponent,
  OverviewPageComponent,
  RecentPageComponent,
];
