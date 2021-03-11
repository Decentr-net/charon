import { FeedPageComponent } from './feed-page';
import { HubPageComponent } from './hub-page';
import { MyPostsPageComponent } from './my-posts-page';
import { PostCreatePageComponent } from './post-create-page';
import { PostPageComponent } from './post-page';
import { PostsPageComponent } from './posts-page';
import { FollowingPageComponent } from './following-page';

export * from './feed-page';
export * from './hub-page';
export * from './my-posts-page';
export * from './post-page';
export * from './posts-page';
export * from './following-page';

export const HUB_PAGES = [
  FeedPageComponent,
  HubPageComponent,
  MyPostsPageComponent,
  PostCreatePageComponent,
  PostPageComponent,
  PostsPageComponent,
  FollowingPageComponent,
];
