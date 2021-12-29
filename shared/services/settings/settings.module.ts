import { ModuleWithProviders, NgModule } from '@angular/core';
import { SettingsService } from './settings.service';

@NgModule()
export class SettingsModule {
  public static forRoot(): ModuleWithProviders<SettingsModule> {
    return {
      ngModule: SettingsModule,
      providers: [
        SettingsService
      ],
    };
  }
}
