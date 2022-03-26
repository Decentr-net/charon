import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgLogoIcon } from '@shared/svg-icons/logo-icon';
import { TechnicalPageRouteData } from './technical-page.definitons';

@Component({
  selector: 'app-technical-page',
  templateUrl: './technical-page.component.html',
  styleUrls: ['./technical-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicalPageComponent {
  public i18nPageKey: string;

  public isNetworkSelectorVisible: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    svgIconRegistry: SvgIconRegistry,
  ) {
    const routeData = this.activatedRoute.snapshot.data as TechnicalPageRouteData;

    this.i18nPageKey = routeData.i18nPageKey;
    this.isNetworkSelectorVisible = routeData.isNetworkSelectorVisible;

    svgIconRegistry.register([
      svgLogoIcon,
    ]);
  }
}
