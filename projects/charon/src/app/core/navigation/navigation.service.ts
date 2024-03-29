import { Injectable } from '@angular/core';
import { filter, map, pairwise } from 'rxjs/operators';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as Browser from 'webextension-polyfill';

import { openExtensionInNewTab } from '@shared/utils/browser';
import { AppRoute } from '../../app-route';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private previousPageUrls: string[] = [];

  constructor(
    private location: Location,
    private router: Router,
  ) {
    this.getUrlChanges().pipe(
      untilDestroyed(this),
    ).subscribe((url) => {
      this.previousPageUrls.push(url);
    });
  }

  public async back(fallbackUrl: string[], startsWith?: string): Promise<void> {
    let urlToNavigate = '';

    do {
      urlToNavigate = this.previousPageUrls.pop();
    }
    while (urlToNavigate && !urlToNavigate.startsWith(startsWith || '') || urlToNavigate === this.router.url);

    const useFallback = !urlToNavigate || !await this.router.navigateByUrl(urlToNavigate);

    if (useFallback) {
      await this.router.navigate(fallbackUrl);
    }

    this.previousPageUrls.pop();
  }

  private getUrlChanges(): Observable<string> {
    return this.router.events.pipe(
      filter((event: NavigationEnd) => event instanceof NavigationEnd),
      pairwise(),
      map(([prev]) => prev.urlAfterRedirects),
    );
  }

  public openInNewTab(url: string): Promise<Browser.Tabs.Tab> {
    const externalLink = this.location.prepareExternalUrl(url);
    return openExtensionInNewTab(externalLink).then();
  }

  public redirectToMaintenancePage(): void {
    this.router.navigate(['/', AppRoute.Maintenance]);
  }

  public redirectToOfflinePage(): void {
    this.router.navigate(['/', AppRoute.Offline]);
  }
}
