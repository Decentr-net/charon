import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  FeedPageComponent,
  HubPageComponent,
  MyWallPageComponent,
  PostsPageComponent,
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
            pathMatch: 'full',
          },
          {
            path: `:${HubCategoryRouteParam}`,
            component: PostsPageComponent,
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
