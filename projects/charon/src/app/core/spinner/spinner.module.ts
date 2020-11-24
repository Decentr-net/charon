import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { SpinnerComponent } from './spinner';
import { SpinnerService } from './spinner.service';

@NgModule({
  imports: [
    OverlayModule,
  ],
  declarations: [
    SpinnerComponent,
  ],
  exports: [
    SpinnerComponent,
  ],
  providers: [
    SpinnerService,
  ],
})
export class SpinnerModule {
}
