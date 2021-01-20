import { ChangeDetectionStrategy, Component } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { svgLogoIcon } from '@shared/svg-icons';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public isInitLoading = true;

  constructor(
    private router: Router,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgLogoIcon,
    ]);
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event =>
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError,
      ),
      take(1),
      untilDestroyed(this),
    ).subscribe(() => {
      this.isInitLoading = false;
    });
  }
}
