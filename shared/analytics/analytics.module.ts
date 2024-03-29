import { ModuleWithProviders, NgModule } from '@angular/core';

import { Environment } from '@environments/environment.definitions';
import { ANALYTICS_DIRECTIVES } from './directives';
import { ANALYTICS_TRACKER_ID } from './analytics.definitions';
import { AnalyticsService } from './analytics.service';
import { AnalyticsClickEventDirective } from '@shared/analytics/directives/analytics-click-event.directive';

@NgModule({
  declarations: [
    ANALYTICS_DIRECTIVES,
  ],
  exports: [
    AnalyticsClickEventDirective,
  ],
})
export class AnalyticsModule {
  constructor(
    analyticsService: AnalyticsService,
  ) {
    analyticsService.initialize();
  }

  public static forRoot(): ModuleWithProviders<AnalyticsModule> {
    return {
      ngModule: AnalyticsModule,
      providers: [
        AnalyticsService,
        {
          provide: ANALYTICS_TRACKER_ID,
          useFactory: (environment: Environment) => environment.ga,
          deps: [Environment],
        },
      ],
    };
  }
}
