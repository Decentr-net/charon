import { FeedPageComponent } from './feed-page';
import { HubPageComponent } from './hub-page';
import { MyWallPageComponent } from './my-wall-page';
import { PostsPageComponent } from './posts-page';
import { OverviewPageComponent } from './overview-page';
import { RecentPageComponent } from './recent-page';

export * from './feed-page';
export * from './hub-page';
export * from './my-wall-page';
export * from './posts-page';
export * from './overview-page';
export * from './recent-page';

export const HUB_PAGES = [
  FeedPageComponent,
  HubPageComponent,
  MyWallPageComponent,
  PostsPageComponent,
  OverviewPageComponent,
  RecentPageComponent,
];
