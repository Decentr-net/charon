import { NgModule } from '@angular/core';

import { TextContentPipe } from './text-content.pipe';

@NgModule({
  declarations: [
    TextContentPipe,
  ],
  exports: [
    TextContentPipe,
  ],
})
export class TextContentModule {
}
