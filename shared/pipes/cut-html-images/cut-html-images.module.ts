import { NgModule } from '@angular/core';

import { CutHtmlImagesPipe } from './cut-html-images.pipe';

@NgModule({
  declarations: [
    CutHtmlImagesPipe,
  ],
  exports: [
    CutHtmlImagesPipe,
  ],
})
export class CutHtmlImagesModule {
}
