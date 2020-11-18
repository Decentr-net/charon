import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  CirclePageComponent,
  MyWallPageComponent,
  NewsPageComponent,
  OverviewPageComponent,
  RecentPageComponent,
} from './pages';
import { CircleRoute, CircleWallRoute } from './circle-route';

const NEWS_PAGE_CHILDREN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: CircleWallRoute.Recent,
  },
  {
    path: CircleWallRoute.Recent,
    component: RecentPageComponent,
  },
  {
    path: CircleWallRoute.MyWall,
    component: MyWallPageComponent,
  },
];

const ROUTES: Routes = [
  {
    path: '',
    component: CirclePageComponent,
    children: [
      {
        path: '',
        redirectTo: CircleRoute.Overview,
        pathMatch: 'full',
      },
      {
        path: CircleRoute.Overview,
        component: OverviewPageComponent,
      },
      {
        path: CircleRoute.News,
        children: [
          {
            path: '',
            component: NewsPageComponent,
            pathMatch: 'full',
            children: NEWS_PAGE_CHILDREN_ROUTES,
          },
          {
            path: CircleRoute.World,
            component: NewsPageComponent,
            children: NEWS_PAGE_CHILDREN_ROUTES,
          },
          {
            path: CircleRoute.TravelAndTourism,
            component: NewsPageComponent,
            children: NEWS_PAGE_CHILDREN_ROUTES,
          },
          {
            path: CircleRoute.ScienceAndTechnology,
            component: NewsPageComponent,
            children: NEWS_PAGE_CHILDREN_ROUTES,
          },
          {
            path: CircleRoute.StrangeWorld,
            component: NewsPageComponent,
            children: NEWS_PAGE_CHILDREN_ROUTES,
          },
          {
            path: CircleRoute.HealthAndCulture,
            component: NewsPageComponent,
            children: NEWS_PAGE_CHILDREN_ROUTES,
          },
          {
            path: CircleRoute.FitnessAndExercise,
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
export class CircleRoutingModule {
}
