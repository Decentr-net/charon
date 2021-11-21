import { ModuleWithProviders, NgModule } from '@angular/core';

import { ANALYTICS_DIRECTIVES } from './directives';
import { AnalyticsService } from './analytics.service';

@NgModule({
  declarations: [
    ANALYTICS_DIRECTIVES,
  ],
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
