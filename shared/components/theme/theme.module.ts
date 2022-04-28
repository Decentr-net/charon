import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ThemeService } from '@shared/components/theme/theme.service';
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

  constructor(
    themeService: ThemeService,
  ) {
    themeService.initialize();
  }

  public static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ThemeService,
      ],
    };
  }
}
