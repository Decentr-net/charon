import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './components/home/home.component';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';
import { ActivityDetailsComponent } from './components/home/activity-details/activity-details.component';
import { ChartComponent } from './components/home/chart/chart.component';

@NgModule({
  imports: [
    UserRoutingModule,
    SharedModule
  ],
  declarations: [
    UserLayoutComponent,
    HomeComponent,
    ActivityDetailsComponent,
    ChartComponent
  ],
  exports: [
    UserRoutingModule
  ],
  entryComponents: [
    // ActivityDetailsComponent
  ]
})
export class UserModule {
}
