import { NgModule } from '@angular/core';

import { RouterLinkScrollAnchorDirective } from './router-link-scroll-anchor.directive';

@NgModule({
  declarations: [
    RouterLinkScrollAnchorDirective,
  ],
  exports: [
    RouterLinkScrollAnchorDirective,
  ],
})
export class RouterLinkScrollAnchorModule {
}
