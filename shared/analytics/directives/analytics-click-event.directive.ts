import { Directive, HostListener, Input } from '@angular/core';

import { AnalyticsEvent } from '../analytics.definitions';
import { AnalyticsService } from '../analytics.service';

@Directive({
  selector: '[appAnalyticsClickEvent]',
})
export class AnalyticsClickEventDirective {
  @Input('appAnalyticsClickEvent') public event: AnalyticsEvent;

  constructor(
    private analyticsService: AnalyticsService,
  ) {
  }

  @HostListener('click')
  public onClick(): void {
    this.analyticsService.sendEvent(this.event);
  }
}
