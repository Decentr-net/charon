import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { InlineSVGModule } from 'ng-inline-svg';

import { LayoutHeaderModule } from '../shared/components/layout-header';
import { USER_PAGES } from './pages';
import { USER_COMPONENTS } from './components';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    InlineSVGModule,
    LayoutHeaderModule,
    MatDialogModule,
    MatMenuModule,
    MatTabsModule,
    UserRoutingModule,
  ],
  declarations: [
    USER_PAGES,
    USER_COMPONENTS,
  ],
})
export class UserModule {
}
