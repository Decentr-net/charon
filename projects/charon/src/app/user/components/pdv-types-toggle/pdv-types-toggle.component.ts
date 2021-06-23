import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PDVType } from 'decentr-js';

import { PDVSettings } from '@shared/services/pdv';

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
export class PdvTypesToggleComponent extends ControlValueAccessor<PDVSettings> implements OnInit {
  public form: FormGroup<PDVSettings>;

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

  public writeValue(value: PDVSettings): void {
    if (!value) {
      return this.form.reset();
    }

    this.form.setValue(value);
  }
}
