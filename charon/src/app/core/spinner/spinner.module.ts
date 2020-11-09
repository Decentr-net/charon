import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { SpinnerComponent } from './spinner.component';
import { SpinnerService } from './spinner.service';

@NgModule({
  imports: [
    OverlayModule,
  ],
  declarations: [
    SpinnerComponent,
  ],
  providers: [
    SpinnerService,
  ],
})
export class SpinnerModule {
}
