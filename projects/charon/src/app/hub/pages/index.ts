import { FeedPageComponent } from './feed-page';
import { HubPageComponent } from './hub-page';
import { MyWallPageComponent } from './my-wall-page';
import { PostPageComponent } from './post-page';
import { PostsPageComponent } from './posts-page';
import { RecentPageComponent } from './recent-page';

export * from './feed-page';
export * from './hub-page';
export * from './my-wall-page';
export * from './post-page';
export * from './posts-page';
export * from './recent-page';

export const HUB_PAGES = [
  FeedPageComponent,
  HubPageComponent,
  MyWallPageComponent,
  PostPageComponent,
  PostsPageComponent,
  RecentPageComponent,
];
