import { NgModule } from '@angular/core';

import { TextClampDirective } from './text-clamp.directive';

@NgModule({
  declarations: [
    TextClampDirective,
  ],
  exports: [
    TextClampDirective,
  ],
})
export class TextClampModule {
}
