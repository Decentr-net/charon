import { NgModule } from '@angular/core';

import { SanitizePipe } from './sanitize.pipe';

@NgModule({
  declarations: [
    SanitizePipe,
  ],
  exports: [
    SanitizePipe,
  ],
})
export class SanitizeModule {
}
