import { NgModule } from '@angular/core';
import { TypefaceDirective } from './typeface.directive';

@NgModule({
  declarations: [
    TypefaceDirective,
  ],
  exports: [
    TypefaceDirective,
  ],
})
export class TypefaceModule {
}
