import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import { AuthBrowserStorageService } from '../../../services/auth';
import { CollectedPDVTypesSettings } from '../../../services/settings';
import { PDVTypesToggleTranslations } from '../pdv-types-toggle';
import { SettingsService } from '../../../services/settings';
import { svgArrowLeft } from '../../../svg-icons/arrow-left';
import { svgSpeedometer } from '../../../svg-icons/speedometer';

const authBrowserStorageService = new AuthBrowserStorageService();

export interface PDVTypesSettingsTranslations {
  subtitle: string;
  title: string;
  types: PDVTypesToggleTranslations;
  warning: string;
}

@UntilDestroy()
@Component({
  selector: 'app-pdv-types-settings',
  templateUrl: './pdv-types-settings.component.html',
  styleUrls: ['./pdv-types-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdvTypesSettingsComponent implements OnInit {
  @Input() public font: 'default' | 'large' = 'default';

  @Input() public translations: PDVTypesSettingsTranslations;

  public settingsControl = new FormControl<CollectedPDVTypesSettings>();

  constructor(
    private settingsService: SettingsService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgArrowLeft,
      svgSpeedometer,
    ]);
  }

  public ngOnInit(): void {
    authBrowserStorageService.getActiveUser().pipe(
      pluck('wallet', 'address'),
      distinctUntilChanged(),
      switchMap((walletAddress) => this.settingsService.getUserSettingsService(walletAddress).pdv.getCollectedPDVTypes()),
      untilDestroyed(this),
    ).subscribe((settings) => {
      this.settingsControl.setValue(settings, { emitEvent: false });
    });

    combineLatest([
      authBrowserStorageService.getActiveUser(),
      this.settingsControl.valueChanges,
    ]).pipe(
      switchMap(([user, settings]) => {
        return this.settingsService.getUserSettingsService(user.wallet.address).pdv.setCollectedPDVTypes(settings);
      }),
      untilDestroyed(this),
    ).subscribe();
  }
}
