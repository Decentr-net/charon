import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { ThemeToggleComponent } from './theme-toggle.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    SvgIconsModule,
  ],
  declarations: [
    ThemeToggleComponent,
  ],
  exports: [
    ThemeToggleComponent,
  ],
})
export class ThemeToggleModule {
}
