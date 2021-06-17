import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgLogoIcon } from '@shared/svg-icons/logo-icon';

@Component({
  selector: 'app-technical-page',
  templateUrl: './technical-page.component.html',
  styleUrls: ['./technical-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicalPageComponent {
  public i18nPageKey: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    svgIconRegistry: SvgIconRegistry,
  ) {
    this.i18nPageKey = this.activatedRoute.snapshot.data['i18nPageKey'];
    svgIconRegistry.register([
      svgLogoIcon,
    ]);
  }
}
