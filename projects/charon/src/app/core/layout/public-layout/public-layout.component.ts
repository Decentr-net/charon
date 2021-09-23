import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { isOpenedInTab } from '@shared/utils/browser';
import { svgLogo } from '@shared/svg-icons/logo';

export const PUBLIC_LAYOUT_INCLUDE_LOGO_KEY = 'includeLogo';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent implements OnInit {
  public includeLogo$: Observable<boolean>;

  @HostBinding('class.mod-tab-view')
  public isTabView = isOpenedInTab();

  constructor(
    private activatedRoute: ActivatedRoute,
    private svgIconRegistry: SvgIconRegistry,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgLogo,
    ]);

    this.includeLogo$ = this.activatedRoute.data.pipe(
      pluck(PUBLIC_LAYOUT_INCLUDE_LOGO_KEY),
    );
  }
}
