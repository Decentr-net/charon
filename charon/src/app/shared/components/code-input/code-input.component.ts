import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  QueryList,
  TrackByFunction,
  ViewChildren,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { BACKSPACE } from '@angular/cdk/keycodes';
import { noop } from 'rxjs';
import { map } from 'rxjs/operators';
import { ControlValueAccessor, FormArray, FormControl } from '@ngneat/reactive-forms';
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
export class CodeInputComponent implements OnInit, AfterViewInit, ControlValueAccessor<string> {
  @Input() public set length(length: number) {
    this.setCharsLength(length);
  }

  @Input() public autofocus: boolean = false;

  @ViewChildren('inputElement', { read: ElementRef })
  public inputElementsRefs: QueryList<ElementRef<HTMLInputElement>>;

  @HostBinding('attr.tabindex')
  public readonly tabIndex: number = -1;

  public formArray: FormArray<string> = new FormArray([]);

  public onChange: (value: string | null) => void = noop;
  public onTouched: () => void = noop;

  public ngOnInit() {
    this.formArray.value$.pipe(
      map(chars => chars.join('')),
      untilDestroyed(this),
    ).subscribe(code => {
      const value = code.length === this.formArray.length ? code : null;
      this.onChange(value);
    });
  }

  public ngAfterViewInit() {
    if (this.autofocus) {
      this.inputElementsRefs.toArray()[0].nativeElement.focus();
    }
  }

  public registerOnChange(fn: (value: (string | null)) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(value: string): void {
    const chars = value.split('');
    this.formArray.patchValue(chars);
  }

  public trackByElem: TrackByFunction<unknown> = ({}, elem) => elem;

  public onInput(event: Event): void {
    if ((event as InputEvent).inputType !== 'deleteContentBackward') {
      this.moveTo(event.target as HTMLInputElement, 'right')
    }
  }

  public onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    if (event.keyCode === BACKSPACE) {
      const hasValue = target.value;
      const currentInput = this.moveTo(event.target as HTMLInputElement, 'left');
      if (!currentInput || hasValue) {
        return;
      }

      const controlIndex = this.inputElementsRefs.toArray()
        .findIndex((ref) => ref.nativeElement === currentInput);
      this.formArray.controls[controlIndex].setValue('');
    }
  }


  private setCharsLength(length: number): void {
    while (this.formArray.length > length) {
      this.formArray.removeAt(this.formArray.length - 1);
    }

    while (this.formArray.length < length) {
      this.formArray.push(new FormControl('', Validators.required))
    }
  }

  private moveTo(from: HTMLInputElement, direction: 'left' | 'right'): HTMLInputElement | null {
    const fromElementRef = this.inputElementsRefs.toArray()
      .findIndex((ref) => ref.nativeElement === from);
    const nextElementRef = this.inputElementsRefs.toArray()[fromElementRef + (direction === 'left' ? -1 : 1)];
    if (nextElementRef) {
      nextElementRef.nativeElement.focus();
      return nextElementRef.nativeElement;
    }
    return null;
  }
}
