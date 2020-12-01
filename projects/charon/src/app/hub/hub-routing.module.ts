import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  FeedPageComponent,
  HubPageComponent,
  MyWallPageComponent,
  PostsPageComponent,
  OverviewPageComponent,
  RecentPageComponent,
} from './pages';
import { HubRoute, HubFeedRoute } from './hub-route';

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
            path: '',
            component: PostsPageComponent,
            pathMatch: 'full',
          },
          {
            path: HubRoute.World,
            component: PostsPageComponent,
          },
          {
            path: HubRoute.TravelAndTourism,
            component: PostsPageComponent,
          },
          {
            path: HubRoute.ScienceAndTechnology,
            component: PostsPageComponent,
          },
          {
            path: HubRoute.StrangeWorld,
            component: PostsPageComponent,
          },
          {
            path: HubRoute.HealthAndCulture,
            component: PostsPageComponent,
          },
          {
            path: HubRoute.FitnessAndExercise,
            component: PostsPageComponent,
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
