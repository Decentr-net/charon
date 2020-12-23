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
import { BACKSPACE, SPACE } from '@angular/cdk/keycodes';
import { fromEvent, noop } from 'rxjs';
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

  @Input() public autofocus = false;

  @ViewChildren('inputElement', { read: ElementRef })
  public inputElementsRefs: QueryList<ElementRef<HTMLInputElement>>;

  @HostBinding('attr.tabindex')
  public readonly tabIndex: number = -1;

  public formArray: FormArray<string> = new FormArray([]);

  public onChange: (value: string | null) => void = noop;
  public onTouched: () => void = noop;

  constructor(private elementRef: ElementRef) {
    fromEvent(this.elementRef.nativeElement, 'keydown', { capture: true })
      .subscribe((event: KeyboardEvent) => this.onKeydown(event));
  }

  public ngOnInit(): void {
    this.formArray.value$.pipe(
      map(chars => chars.join('')),
      untilDestroyed(this),
    ).subscribe(code => {
      const value = code.length === this.formArray.length ? code : null;
      this.onChange(value);
    });
  }

  public ngAfterViewInit(): void {
    if (this.autofocus) {
      this.getInputAt(0).focus();
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
      this.moveFrom(event.target as HTMLInputElement, 'right');
    }
  }

  public onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;

    switch (event.keyCode) {
      case BACKSPACE: {
        const hasValue = target.value;

        const controlIndex = this.inputElementsRefs.toArray()
          .findIndex((ref) => ref.nativeElement === event.target);

        if (hasValue) {
          this.getControlAt(controlIndex).setValue('');
        } else {
          const prevControl = this.getControlAt(controlIndex - 1);
          if (prevControl) {
            prevControl.setValue('');
          }
        }

        this.moveFrom(event.target as HTMLInputElement, 'left');

        event.preventDefault();
        break;
      }
      case SPACE: {
        event.preventDefault();
        break;
      }
    }
  }

  public onPaste(pasteEvent: ClipboardEvent): void {
    const text = pasteEvent.clipboardData.getData('Text');

    const inputToFocus = this.getInputAt(Math.min(text.length, this.formArray.length - 1));
    inputToFocus.focus();

    this.writeValue(text);
  }


  private setCharsLength(length: number): void {
    while (this.formArray.length > length) {
      this.formArray.removeAt(this.formArray.length - 1);
    }

    while (this.formArray.length < length) {
      this.formArray.push(new FormControl('', Validators.required));
    }
  }

  private getControlAt(index: number): FormControl<string> {
    return this.formArray.controls[index];
  }

  private getInputAt(index: number): HTMLInputElement | undefined {
    return this.inputElementsRefs.toArray()[index].nativeElement;
  }

  private moveFrom(from: HTMLInputElement, direction: 'left' | 'right'): HTMLInputElement | null {
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
