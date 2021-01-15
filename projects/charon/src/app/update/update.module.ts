import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { UPDATE_PAGES } from './pages';
import { UpdateRoutingModule } from './update-routing.module';

@NgModule({
  imports: [
    SvgIconsModule,
    TranslocoModule,
    UpdateRoutingModule,
  ],
  declarations: [
    UPDATE_PAGES,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'update',
    },
  ],
})
export class UpdateModule {
}
