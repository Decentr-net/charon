import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction } from '@angular/core';
import { ControlValueAccessor, FormArray, FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { noop } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-code-input',
  templateUrl: './code-input.component.html',
  styleUrls: ['./code-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CodeInputComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeInputComponent implements OnInit, ControlValueAccessor<string> {
  @Input() public set length(length: number) {
    this.setCharsLength(length);
  }

  public form: FormGroup<{ chars: string[] }>

  public onChange: (value: string | null) => void = noop;
  public onTouched: () => void = noop;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      chars: formBuilder.array([]),
    });
  }

  public ngOnInit() {
    this.form.value$.pipe(
      pluck('chars'),
      map(chars => chars.join('')),
      untilDestroyed(this),
    ).subscribe(code => {
      const value = code.length === this.charsArrayControl.length ? code : null;
      this.onChange(value);
    });
  }

  public get charsArrayControl(): FormArray<string> {
    return this.form.controls.chars as FormArray;
  }

  public registerOnChange(fn: (value: (string | null)) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(value: string): void {
    const chars = value.split('');
    this.charsArrayControl.patchValue(chars);
  }

  public trackByElem: TrackByFunction<unknown> = ({}, elem) => elem;

  private setCharsLength(length: number): void {
    while (this.charsArrayControl.length > length) {
      this.charsArrayControl.removeAt(this.charsArrayControl.length - 1);
    }

    while (this.charsArrayControl.length < length) {
      this.charsArrayControl.push(new FormControl('', Validators.required))
    }
  }
}
