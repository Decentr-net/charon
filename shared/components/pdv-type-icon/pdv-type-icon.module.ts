import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { PdvTypeIconComponent } from './pdv-type-icon.component';

@NgModule({
  imports: [
    SvgIconsModule,
  ],
  declarations: [
    PdvTypeIconComponent,
  ],
  exports: [
    PdvTypeIconComponent,
  ],
})
export class PdvTypeIconModule {
}
