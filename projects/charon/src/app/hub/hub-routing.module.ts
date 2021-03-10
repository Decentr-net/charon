import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';

import {
  FeedPageComponent,
  HubPageComponent,
  MyPostsPageComponent,
  PostPageComponent,
  PostsPageComponent,
  FollowingPageComponent,
} from './pages';
import {
  HubRoute,
  HubFeedRoute,
  HubCategoryRouteParam,
  HubPostIdRouteParam,
  HubPostOwnerRouteParam,
  HubPostOutletName,
} from './hub-route';
import { PostCreatePageComponent } from './pages/post-create-page';

const POST_ROUTE: Route = {
  path: `${HubRoute.Post}/:${HubPostOwnerRouteParam}/:${HubPostIdRouteParam}`,
  component: PostPageComponent,
  pathMatch: 'full',
};

const FEED_PAGE_CHILDREN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: HubFeedRoute.Following,
  },
  {
    path: HubFeedRoute.Following,
    component: FollowingPageComponent,
  },
  {
    path: HubFeedRoute.MyPosts,
    component: MyPostsPageComponent,
  },
  {
    ...POST_ROUTE,
    outlet: HubPostOutletName,
  },
];

const POSTS_PAGE_CHILDREN_ROUTES: Routes = [
  POST_ROUTE,
];

const ROUTES: Routes = [
  {
    path: '',
    component: HubPageComponent,
    children: [
      {
        path: '',
        redirectTo: HubRoute.Posts,
        pathMatch: 'full',
      },
      {
        path: HubRoute.Feed,
        component: FeedPageComponent,
        children: FEED_PAGE_CHILDREN_ROUTES,
      },
      {
        path: HubRoute.PostCreate,
        component: PostCreatePageComponent,
      },
      {
        path: HubRoute.Posts,
        children: [
          {
            path: '',
            component: PostsPageComponent,
            children: POSTS_PAGE_CHILDREN_ROUTES,
          },
          {
            path: `:${HubCategoryRouteParam}`,
            component: PostsPageComponent,
            children: POSTS_PAGE_CHILDREN_ROUTES,
          },
          {
            path: '**',
            redirectTo: '',
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
  ],
  exports: [
    RouterModule,
  ],
})
export class HubRoutingModule {
}
