import { NgModule } from '@angular/core';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { SharedModule } from '../shared/shared.module';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PublicRoutingModule } from './public-routing.module';

@NgModule({
  imports: [
    PublicRoutingModule,
    SharedModule
  ],
  declarations: [
    PublicLayoutComponent,
    WelcomeComponent
  ],
  exports: [
    PublicRoutingModule
  ]
})
export class PublicModule {
}
