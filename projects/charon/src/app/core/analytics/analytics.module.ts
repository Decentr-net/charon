import { ModuleWithProviders, NgModule } from '@angular/core';

import { AnalyticsService } from './analytics.service';

@NgModule({
})
export class AnalyticsModule {
  public static forRoot(): ModuleWithProviders<AnalyticsModule> {
    return {
      ngModule: AnalyticsModule,
      providers: [
        AnalyticsService,
      ],
    };
  }
}
