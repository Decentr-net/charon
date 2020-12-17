import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor, FormControl } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-hub-text-editor',
  templateUrl: './hub-text-editor.component.html',
  styleUrls: ['./hub-text-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: HubTextEditorComponent,
      multi: true,
    },
  ],
})
export class HubTextEditorComponent extends ControlValueAccessor<string> implements OnInit {
  public formControl = new FormControl<string>();

  public ngOnInit() {
    this.formControl.valueChanges.pipe(
      untilDestroyed(this),
    ).subscribe((value) => this.onChange(value));
  }

  public writeValue(value: string): void {
    this.formControl.setValue(value, { emitEvent: false });
  }
}
