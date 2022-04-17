import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ThemeToggleComponent } from './theme-toggle.component';

@NgModule({
  imports: [
    FormsModule,
    MatSlideToggleModule,
  ],
  declarations: [
    ThemeToggleComponent,
  ],
  exports: [
    ThemeToggleComponent,
  ],
})
export class ThemeModule {
}
