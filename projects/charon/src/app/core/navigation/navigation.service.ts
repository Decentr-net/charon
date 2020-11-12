import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Tabs } from 'webextension-polyfill-ts';

import { openExtensionInNewTab } from '@core/browser';

@Injectable()
export class NavigationService {
  constructor(private location: Location) {
  }

  public back(): void {
    this.location.back();
  }

  public openInNewTab(url: string): Promise<Tabs.Tab> {
    const externalLink = this.location.prepareExternalUrl(url);
    return openExtensionInNewTab(externalLink).then();
  }
}
