import { NgModule } from '@angular/core';

import { CIRCLE_COMPONENTS } from './components';
import { CIRCLE_PAGES } from './pages';
import { CircleRoutingModule } from './circle-routing.module';

@NgModule({
  declarations: [
    CIRCLE_COMPONENTS,
    CIRCLE_PAGES,
  ],
  imports: [
    CircleRoutingModule,
  ],
})
export class CircleModule {
}
