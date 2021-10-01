import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, filter, first, map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Environment } from '@environments/environment.definitions';

@UntilDestroy()
@Injectable()
export class AnalyticsService {
  private initialized: ReplaySubject<void> = new ReplaySubject(1);

  constructor(
    private environment: Environment,
    private router: Router,
  ) {
  }

  public initialize(): void {
    this.injectScript();
    this.setTrackingId();
  }

  public initializePageTracking(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects.split('?')[0]),
      distinctUntilChanged(),
      untilDestroyed(this),
    ).subscribe((url) => this.sendPageView(url));
  }

  private get analytics(): GoogleAnalyticsCode {
    return window._gaq || [];
  }

  private injectScript(): void {
    const gaScript = document.createElement('script');
    gaScript.type = 'text/javascript';
    gaScript.async = true;
    gaScript.src = 'https://ssl.google-analytics.com/ga.js';

    gaScript.onload = () => {
      this.initialized.next();
    };

    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gaScript, s);
  }

  private onInitialized(): Observable<void> {
    return this.initialized.pipe(
      first(),
    );
  }

  private setTrackingId(): void {
    this.onInitialized().subscribe(() => this.analytics.push(['_setAccount', this.environment.ga]));
  }

  private sendPageView(url: string): void {
    this.onInitialized().subscribe(() => this.analytics.push(['_trackPageview', url]));
  }
}
