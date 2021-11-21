import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlsOf, ControlValueAccessor, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PDVType } from 'decentr-js';

import { CollectedPDVTypesSettings } from '../../../services/settings';

export type PDVTypesToggleTranslations = Record<keyof CollectedPDVTypesSettings, string>;

@UntilDestroy()
@Component({
  selector: 'app-pdv-types-toggle',
  templateUrl: './pdv-types-toggle.component.html',
  styleUrls: ['./pdv-types-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PdvTypesToggleComponent,
      multi: true,
    },
  ],
})
export class PdvTypesToggleComponent extends ControlValueAccessor<CollectedPDVTypesSettings> implements OnInit {
  @Input() public translations: PDVTypesToggleTranslations;

  public form: FormGroup<ControlsOf<CollectedPDVTypesSettings>>;

  public types: string[];

  constructor(
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      [PDVType.AdvertiserId]: false,
      [PDVType.Cookie]: false,
      [PDVType.Location]: false,
      [PDVType.SearchHistory]: false,
    });

    this.types = Object.keys(this.form.controls);

    this.form.valueChanges.pipe(
      untilDestroyed(this),
    ).subscribe((value) => this.onChange(value));
  }

  public writeValue(value: CollectedPDVTypesSettings): void {
    if (!value) {
      return this.form.reset();
    }

    this.form.setValue(value);
  }
}
