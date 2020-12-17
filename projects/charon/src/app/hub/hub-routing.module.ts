import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostCategory } from 'decentr-js';

import {
  FeedPageComponent,
  HubPageComponent,
  MyWallPageComponent,
  PostsPageComponent,
  OverviewPageComponent,
  RecentPageComponent,
} from './pages';
import { HubRoute, HubFeedRoute, HubCategoryRouteParam } from './hub-route';

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

const ROUTES: Routes = [
  {
    path: '',
    component: HubPageComponent,
    children: [
      {
        path: '',
        redirectTo: HubRoute.Overview,
        pathMatch: 'full',
      },
      {
        path: HubRoute.Overview,
        component: OverviewPageComponent,
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
            path: `:${HubCategoryRouteParam}`,
            component: PostsPageComponent,
          },
          {
            path: '**',
            redirectTo: PostCategory.WorldNews.toString(),
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
