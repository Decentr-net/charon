import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  FeedPageComponent,
  HubPageComponent,
  MyWallPageComponent,
  PostPageComponent,
  PostsPageComponent,
  RecentPageComponent,
} from './pages';
import {
  HubRoute,
  HubFeedRoute,
  HubCategoryRouteParam,
  HubPostIdRouteParam,
  HubPostOwnerRouteParam
} from './hub-route';

const FEED_PAGE_CHILDREN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: HubFeedRoute.Recent,
  },
  {
    path: HubFeedRoute.Recent,
    component: RecentPageComponent,
  },
  {
    path: HubFeedRoute.MyWall,
    component: MyWallPageComponent,
  },
];

const POSTS_PAGE_CHILDREN_ROUTES: Routes = [
  {
    path: `${HubRoute.Post}/:${HubPostOwnerRouteParam}/:${HubPostIdRouteParam}`,
    component: PostPageComponent,
    pathMatch: 'full',
  },
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
