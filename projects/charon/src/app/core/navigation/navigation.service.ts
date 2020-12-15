import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { openExtensionInNewTab } from '@core/browser';
import { Router, RoutesRecognized } from '@angular/router';
import { Tabs } from 'webextension-polyfill-ts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable()
export class NavigationService {
  private previousPageUrl: string = undefined;

  constructor(
    private location: Location,
    private router: Router,
  ) {
    this.getUrlChanges().pipe(
      untilDestroyed(this),
    ).subscribe(url => this.previousPageUrl = url);
  }

  public back(): void {
    this.location.back();
  }

  public backIfNoHistory(url: string[]): void {
    const navigateUrl = this.previousPageUrl ? [this.previousPageUrl] : url;

    this.router.navigate(navigateUrl);
  }

  private getUrlChanges(): Observable<string> {
    return this.router.events.pipe(
      filter(e => e instanceof RoutesRecognized),
      map(() => this.router.url),
    )
  }

  public openInNewTab(url: string): Promise<Tabs.Tab> {
    const externalLink = this.location.prepareExternalUrl(url);
    return openExtensionInNewTab(externalLink).then();
  }
}
