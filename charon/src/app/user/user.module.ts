import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { InlineSVGModule } from 'ng-inline-svg';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { LayoutHeaderModule } from '@shared/components/layout-header';
import { USER_PAGES } from './pages';
import { USER_COMPONENTS } from './components';
import { UserRoutingModule } from './user-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    InlineSVGModule,
    LayoutHeaderModule,
    MatDialogModule,
    MatMenuModule,
    MatTabsModule,
    MatTooltipModule,
    TranslocoModule,
    UserRoutingModule,
  ],
  declarations: [
    USER_PAGES,
    USER_COMPONENTS,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'user',
    },
  ],
})
export class UserModule {
}
