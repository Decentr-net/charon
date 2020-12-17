import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { InlineSVGModule } from 'ng-inline-svg';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { FormErrorModule } from '@shared/components/form-error';
import { NavigationModule } from '@core/navigation';
import { ProfileFormModule } from '@shared/components/profile-form';
import { ToolbarStateService } from '@shared/services/toolbar-state';
import { LayoutHeaderModule } from '../layout/layout-header';
import { PdvValueModule } from '@shared/pipes/pdv-value';
import { USER_PAGES } from './pages';
import { USER_COMPONENTS } from './components';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormErrorModule,
    FormsModule,
    InlineSVGModule,
    LayoutHeaderModule,
    MatExpansionModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTooltipModule,
    NavigationModule,
    PdvValueModule,
    ProfileFormModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
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
    {
      provide: ToolbarStateService,
      useClass: ToolbarStateService,
    }
  ],
})
export class UserModule {
}
