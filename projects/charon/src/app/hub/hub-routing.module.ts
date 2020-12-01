import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  HubPageComponent,
  MyWallPageComponent,
  NewsPageComponent,
  OverviewPageComponent,
  RecentPageComponent,
} from './pages';
import { HubRoute, HubWallRoute } from './hub-route';

const NEWS_PAGE_CHILDREN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: HubWallRoute.Recent,
  },
  {
    path: HubWallRoute.Recent,
    component: RecentPageComponent,
  },
  {
    path: HubWallRoute.MyWall,
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
        path: HubRoute.News,
        children: [
          {
            path: '',
            component: NewsPageComponent,
            pathMatch: 'full',
            children: NEWS_PAGE_CHILDREN_ROUTES,
          },
          {
            path: HubRoute.World,
            component: NewsPageComponent,
            children: NEWS_PAGE_CHILDREN_ROUTES,
          },
          {
            path: HubRoute.TravelAndTourism,
            component: NewsPageComponent,
            children: NEWS_PAGE_CHILDREN_ROUTES,
          },
          {
            path: HubRoute.ScienceAndTechnology,
            component: NewsPageComponent,
            children: NEWS_PAGE_CHILDREN_ROUTES,
          },
          {
            path: HubRoute.StrangeWorld,
            component: NewsPageComponent,
            children: NEWS_PAGE_CHILDREN_ROUTES,
          },
          {
            path: HubRoute.HealthAndCulture,
            component: NewsPageComponent,
            children: NEWS_PAGE_CHILDREN_ROUTES,
          },
          {
            path: HubRoute.FitnessAndExercise,
            component: NewsPageComponent,
            children: NEWS_PAGE_CHILDREN_ROUTES,
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
