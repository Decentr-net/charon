import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CirclePageComponent, NewsPageComponent, OverviewPageComponent } from './pages';
import { CircleRoute } from './circle-route';

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
          },
          {
            path: CircleRoute.World,
            component: NewsPageComponent,
          },
          {
            path: CircleRoute.TravelAndTourism,
            component: NewsPageComponent,
          },
          {
            path: CircleRoute.ScienceAndTechnology,
            component: NewsPageComponent,
          },
          {
            path: CircleRoute.StrangeWorld,
            component: NewsPageComponent,
          },
          {
            path: CircleRoute.HealthAndCulture,
            component: NewsPageComponent,
          },
          {
            path: CircleRoute.FitnessAndExercise,
            component: NewsPageComponent,
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
