import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { TypefaceModule } from '../../directives/typeface';
import { ButtonModule } from '../button';
import { SpinnerModule } from '../spinner';
import { NetworkSelectorComponent } from './network-selector.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    MatMenuModule,
    SpinnerModule,
    SvgIconsModule,
    TypefaceModule,
  ],
  declarations: [
    NetworkSelectorComponent,
  ],
  exports: [
    NetworkSelectorComponent,
  ],
})
export class NetworkSelectorModule {
}
