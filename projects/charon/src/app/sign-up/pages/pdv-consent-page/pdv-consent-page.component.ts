import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TranslocoService } from '@ngneat/transloco';

import { svgSend } from '@shared/svg-icons/send';
import { PDVTypesSettingsTranslations } from '@shared/components/pdv-types-settings';
import { AuthService } from '@core/auth/services';
import { SettingsService } from '@shared/services/settings';
import { SignUpRoute } from '../../sign-up-route';

@Component({
  selector: 'app-pdv-consent-page',
  templateUrl: './pdv-consent-page.component.html',
  styleUrls: ['./pdv-consent-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PDVConsentPageComponent implements OnInit {
  public translations$: Observable<PDVTypesSettingsTranslations>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private settingsService: SettingsService,
    private svgIconRegistry: SvgIconRegistry,
    private translocoService: TranslocoService,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgSend,
    ]);

    this.translations$ = combineLatest([
      this.translocoService.selectTranslateObject('pdv_types_settings', null, 'shared'),
      this.translocoService.selectTranslateObject('pdv_types_toggle', null, 'shared'),
    ]).pipe(
      map(([pdv_types_settings, pdv_types_toggle]) => ({
        ...pdv_types_settings,
        types: pdv_types_toggle,
      })),
    );
  }

  public confirm(): void {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    this.settingsService.getUserSettingsService(walletAddress).pdv.setCollectionConfirmed(true).then(() => {
      return this.router.navigate(['../', SignUpRoute.Success], { relativeTo: this.activatedRoute });
    });
  }
}
