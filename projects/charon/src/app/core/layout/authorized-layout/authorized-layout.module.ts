import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { AutomationModule } from '@shared/directives/automation';
import { MenuModule } from '@shared/components/menu';
import { SlotModule } from '@shared/components/slot';
import { BrowserViewModule } from '@shared/directives/browser-view';
import { DragScrollModule } from '@shared/directives/drag-scroll';
import { MouseWheelHorizontalScrollModule } from '@shared/directives/mouse-wheel-horizontal-scroll';
import { RouterLinkScrollAnchorModule } from '@shared/directives/router-link-scroll-anchor';
import { LayoutFooterModule } from '../layout-footer';
import { AuthorizedLayoutComponent } from './authorized-layout.component';
import { AuthorizedLayoutHeaderComponent } from './authorized-layout-header';
import {
  AuthorizedLayoutNavigationComponent,
  AuthorizedLayoutNavigationDefDirective,
} from './authorized-layout-navigation';
import {
  AuthorizedLayoutNavigationLinkComponent,
  AuthorizedLayoutNavigationLinkDefDirective,
} from './authorized-layout-navigation-link';

@NgModule({
  declarations: [
    AuthorizedLayoutComponent,
    AuthorizedLayoutHeaderComponent,
    AuthorizedLayoutNavigationComponent,
    AuthorizedLayoutNavigationDefDirective,
    AuthorizedLayoutNavigationLinkComponent,
    AuthorizedLayoutNavigationLinkDefDirective,
  ],
  imports: [
    AutomationModule,
    BrowserViewModule,
    CommonModule,
    DragScrollModule,
    LayoutFooterModule,
    MenuModule,
    MouseWheelHorizontalScrollModule,
    RouterModule,
    RouterLinkScrollAnchorModule,
    SlotModule,
    SvgIconsModule,
  ],
  exports: [
    AuthorizedLayoutComponent,
    AuthorizedLayoutNavigationDefDirective,
    AuthorizedLayoutNavigationLinkDefDirective,
  ],
})
export class AuthorizedLayoutModule {
}
