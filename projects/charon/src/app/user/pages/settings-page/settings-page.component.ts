import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';
import { FormControl } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { svgArrowLeft } from '@shared/svg-icons/arrow-left';
import { svgEyeCrossed } from '@shared/svg-icons/eye-crossed';
import { PDVService, PDVSettings } from '@shared/services/pdv';
import { AuthService } from '@core/auth';

@UntilDestroy()
@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent implements OnInit {
  public settingsControl = new FormControl<PDVSettings>();

  constructor(
    private authService: AuthService,
    private pdvService: PDVService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgArrowLeft,
      svgEyeCrossed,
    ]);
  }

  public ngOnInit(): void {
    this.authService.getActiveUser().pipe(
      pluck('wallet', 'address'),
      distinctUntilChanged(),
      switchMap((walletAddress) => this.pdvService.getUserSettings(walletAddress)),
      untilDestroyed(this),
    ).subscribe((settings) => {
      this.settingsControl.setValue(settings, { emitEvent: false });
    });

    this.settingsControl.valueChanges.pipe(
      switchMap((settings) => this.pdvService.setUserSettings(
        this.authService.getActiveUserInstant().wallet.address,
        settings,
      )),
      untilDestroyed(this),
    ).subscribe();
  }
}
