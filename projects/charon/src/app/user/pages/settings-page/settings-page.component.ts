import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';
import { FormControl } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CollectedPDVTypesSettings, SettingsService } from '@shared/services/settings';
import { svgArrowLeft } from '@shared/svg-icons/arrow-left';
import { svgEyeCrossed } from '@shared/svg-icons/eye-crossed';
import { AuthService } from '@core/auth';

@UntilDestroy()
@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent implements OnInit {
  public settingsControl = new FormControl<CollectedPDVTypesSettings>();

  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
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
      switchMap((walletAddress) => this.settingsService.getUserSettingsService(walletAddress).pdv.getCollectedPDVTypes()),
      untilDestroyed(this),
    ).subscribe((settings) => {
      this.settingsControl.setValue(settings, { emitEvent: false });
    });

    this.settingsControl.valueChanges.pipe(
      switchMap((settings) => this.settingsService.getUserSettingsService(
        this.authService.getActiveUserInstant().wallet.address,
      ).pdv.setCollectedPDVTypes(settings)),
      untilDestroyed(this),
    ).subscribe();
  }
}
