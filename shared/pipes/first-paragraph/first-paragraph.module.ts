import { NgModule } from '@angular/core';

import { FirstParagraphPipe } from './first-paragraph.pipe';

@NgModule({
  declarations: [
    FirstParagraphPipe,
  ],
  exports: [
    FirstParagraphPipe,
  ],
})
export class FirstParagraphModule {
}
