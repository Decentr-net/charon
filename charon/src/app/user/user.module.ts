import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './components/home/home.component';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';
import { ActivityDetailsComponent } from './components/home/activity-details/activity-details.component';
import { ChartComponent } from './components/home/chart/chart.component';
import { LayoutHeaderModule } from '../shared/components/layout-header';
import { MatMenuModule } from '@angular/material/menu';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    InlineSVGModule,
    LayoutHeaderModule,
    MatMenuModule,
    MatTabsModule,
    UserRoutingModule,
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
