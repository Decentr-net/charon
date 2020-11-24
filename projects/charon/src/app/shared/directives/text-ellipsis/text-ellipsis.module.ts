import { NgModule } from '@angular/core';

import { TextEllipsisDirective } from './text-ellipsis.directive';

@NgModule({
  declarations: [
    TextEllipsisDirective,
  ],
  exports: [
    TextEllipsisDirective,
  ],
})
export class TextEllipsisModule {
}
