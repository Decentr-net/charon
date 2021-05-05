import { Injectable } from '@angular/core';
import { filter, map, pairwise } from 'rxjs/operators';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Tabs } from 'webextension-polyfill-ts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { openExtensionInNewTab } from '@shared/utils/browser';
import { AppRoute } from '../../app-route';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private previousPageUrl: string;

  constructor(
    private location: Location,
    private router: Router,
  ) {
    this.getUrlChanges().pipe(
      untilDestroyed(this),
    ).subscribe((url) => this.previousPageUrl = url);
  }

  public async back(fallbackUrl: string[]): Promise<void> {
    if (this.previousPageUrl && await this.router.navigateByUrl(this.previousPageUrl)) {
      return;
    }

    this.router.navigate(fallbackUrl);
  }

  private getUrlChanges(): Observable<string> {
    return this.router.events.pipe(
      filter((event: NavigationEnd) => event instanceof NavigationEnd),
      pairwise(),
      map(([prev]) => prev.urlAfterRedirects),
    )
  }

  public openInNewTab(url: string): Promise<Tabs.Tab> {
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
