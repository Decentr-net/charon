import { NgModule } from '@angular/core';

import { BrowserPopupViewDirective } from './browser-popup-view.directive';
import { BrowserTabViewDirective } from './browser-tab-view.directive';

@NgModule({
  declarations: [
    BrowserPopupViewDirective,
    BrowserTabViewDirective,
  ],
  exports: [
    BrowserPopupViewDirective,
    BrowserTabViewDirective,
  ],
})
export class BrowserViewModule {
}
