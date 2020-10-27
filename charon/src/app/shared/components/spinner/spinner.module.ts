import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@NgModule({
  imports: [
    OverlayModule
  ],
  declarations: [
    SpinnerComponent
  ]
})
export class SpinnerModule {
}
