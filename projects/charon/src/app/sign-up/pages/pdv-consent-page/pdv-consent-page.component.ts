import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';

import { PDVTypesSettingsTranslations } from '@shared/components/pdv-types-settings';
import { SettingsService } from '@shared/services/settings';
import { AuthService } from '@core/auth/services';
import { UserService } from '@core/services';
import { SignUpRoute } from '../../sign-up-route';

@Component({
  selector: 'app-pdv-consent-page',
  templateUrl: './pdv-consent-page.component.html',
  styleUrls: ['./pdv-consent-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PDVConsentPageComponent implements OnInit {
  public translations$: Observable<PDVTypesSettingsTranslations>;

  public hasProfile$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private settingsService: SettingsService,
    private translocoService: TranslocoService,
  ) {
  }

  public ngOnInit(): void {
    this.translations$ = combineLatest([
      this.translocoService.selectTranslateObject('pdv_types_settings', null, 'shared'),
      this.translocoService.selectTranslateObject('pdv_types_toggle', null, 'shared'),
    ]).pipe(
      map(([pdvTypesSettings, pdvTypesToggle]) => ({
        ...pdvTypesSettings,
        types: pdvTypesToggle,
      })),
    );

    this.hasProfile$ = this.authService.getActiveUserAddress().pipe(
      switchMap((walletAddress) => this.userService.getProfile(walletAddress)),
      map((profile) => !!profile),
    );
  }

  public confirm(): void {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    this.settingsService.getUserSettingsService(walletAddress).pdv.setCollectionConfirmed(true).then(() => {
      return this.router.navigate(['../', SignUpRoute.Success], { relativeTo: this.activatedRoute });
    });
  }
}
