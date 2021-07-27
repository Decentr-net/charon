import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { combineLatest, Observable } from 'rxjs';

import { PDVTypesSettingsTranslations } from '@shared/components/pdv-types-settings/pdv-types-settings';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  public translations$: Observable<PDVTypesSettingsTranslations>;

  constructor(
    private translocoService: TranslocoService,
  ) {
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
}
