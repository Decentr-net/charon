import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';

import { PdvTypeIconModule } from '../pdv-type-icon';
import { PdvTypesSettingsComponent } from './pdv-types-settings';
import { PdvTypesToggleComponent } from './pdv-types-toggle';
import { TypefaceModule } from '../../directives/typeface';

@NgModule({
  imports: [
    CommonModule,
    MatSlideToggleModule,
    PdvTypeIconModule,
    ReactiveFormsModule,
    SvgIconsModule,
    TranslocoModule,
    TypefaceModule,
  ],
  declarations: [
    PdvTypesSettingsComponent,
    PdvTypesToggleComponent,
  ],
  exports: [
    PdvTypesSettingsComponent,
    PdvTypesToggleComponent,
  ],
})
export class PdvTypesSettingsModule {
}
