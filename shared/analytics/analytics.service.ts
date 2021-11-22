import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, filter, first, map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import {
  ANALYTICS_EVENT_MAP,
  ANALYTICS_TRACKER_ID,
  AnalyticsEvent,
  AnalyticsEventOptions
} from './analytics.definitions';

@UntilDestroy()
@Injectable()
export class AnalyticsService {
  private initialized: ReplaySubject<UniversalAnalytics.ga> = new ReplaySubject(1);

  constructor(
    @Inject(ANALYTICS_TRACKER_ID) private trackerId: string,
    private router: Router,
  ) {
  }

  public initialize(): void {
    this.injectScript();

    this.setTrackingId();
    this.allowNonHTTPRequests();
    this.setBeaconMode();

    this.initializePageTracking();
  }

  private initializePageTracking(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects.split('?')[0]),
      distinctUntilChanged(),
      untilDestroyed(this),
    ).subscribe((url) => this.sendPageView(url));
  }

  private injectScript(): void {
    const gaScript = document.createElement('script');
    gaScript.type = 'text/javascript';
    gaScript.async = true;
    gaScript.src = 'https://ssl.google-analytics.com/analytics.js';

    gaScript.onload = () => {
      this.initialized.next(window.ga);
    };

    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gaScript, s);
  }

  public onInitialized(): Observable<UniversalAnalytics.ga> {
    return this.initialized.pipe(
      first(),
    );
  }

  public sendEvent(event: AnalyticsEvent | AnalyticsEventOptions): void {
    const eventOptions = typeof event === 'object'
      ? event
      : ANALYTICS_EVENT_MAP[event];

    this.onInitialized().subscribe((analytics) => analytics('send', 'event', {
      eventCategory: eventOptions.category,
      eventAction: eventOptions.action,
      eventLabel: eventOptions.label,
      eventValue: eventOptions.value,
    }));
  }

  private allowNonHTTPRequests(): void {
    this.onInitialized().subscribe((analytics) => analytics('set', 'checkProtocolTask', null));
  }

  private setTrackingId(): void {
    this.onInitialized().subscribe((analytics) => analytics('create', this.trackerId, 'auto'));
  }

  private sendPageView(url: string): void {
    this.onInitialized().subscribe((analytics) => analytics('send', 'pageview', url));
  }

  private setBeaconMode(): void {
    this.onInitialized().subscribe((analytics) => analytics('set', 'transport', 'beacon'));
  }
}
