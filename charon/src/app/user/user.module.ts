import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './components/home/home.component';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';
import { ActivityDetailsComponent } from './components/home/activity-details/activity-details.component';

@NgModule({
  imports: [
    UserRoutingModule,
    SharedModule
  ],
  declarations: [
    UserLayoutComponent,
    HomeComponent,
    ActivityDetailsComponent,
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
