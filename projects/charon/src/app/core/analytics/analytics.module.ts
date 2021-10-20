import { NgModule } from '@angular/core';

import { AnalyticsService } from './analytics.service';

@NgModule({
  providers: [
    AnalyticsService,
  ],
})
export class AnalyticsModule {
  constructor(analyticsService: AnalyticsService) {
    analyticsService.initialize();

    analyticsService.initializePageTracking();
  }
}
