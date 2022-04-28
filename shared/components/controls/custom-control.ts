import { ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@ngneat/reactive-forms';
import { NgControl } from '@angular/forms';
import { EMPTY, merge, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { untilDestroyed } from '@ngneat/until-destroy';

import { SubmitSourceDirective } from '../../directives/submit-source';
import { InputContainerControl } from '../input-container';

export abstract class CustomControl<T> extends ControlValueAccessor<T> implements InputContainerControl {
  public touched: Subject<void> = new Subject();

  public value: T;

  public isDisabled: boolean;

  protected constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected elementRef: ElementRef<HTMLElement>,
    protected ngControl: NgControl,
    protected renderer2: Renderer2,
    protected submitSource?: SubmitSourceDirective,
  ) {
    super();

    ngControl.valueAccessor = this;
  }


  public set hasWarningError(value: boolean) {
    const warningClass = 'mod-warning';

    if (value) {
      this.renderer2.addClass(this.elementRef.nativeElement, warningClass);
    } else {
      this.renderer2.removeClass(this.elementRef.nativeElement, warningClass);
    }
  }

  public init(): void {
    merge(
      this.ngControl.statusChanges,
      this.submitSource?.statusChanges || EMPTY,
      this.submitSource?.ngSubmit || EMPTY,
      this.touched,
    ).pipe(
      startWith(0),
      untilDestroyed(this),
    ).subscribe(() => {
      const emptyClass = 'is-empty';
      const invalidClass = 'is-invalid';
      const touchedClass = 'is-touched';
      const submittedClass = 'is-submitted';

      if (this.value) {
        this.renderer2.removeClass(this.elementRef.nativeElement, emptyClass);
      } else {
        this.renderer2.addClass(this.elementRef.nativeElement, emptyClass);
      }

      if (this.ngControl.invalid) {
        this.renderer2.addClass(this.elementRef.nativeElement, invalidClass);
      } else {
        this.renderer2.removeClass(this.elementRef.nativeElement, invalidClass);
      }

      if (this.ngControl.touched) {
        this.renderer2.addClass(this.elementRef.nativeElement, touchedClass);
      } else {
        this.renderer2.removeClass(this.elementRef.nativeElement, touchedClass);
      }

      if (this.submitSource?.submitted) {
        this.renderer2.addClass(this.elementRef.nativeElement, submittedClass);
      } else {
        this.renderer2.removeClass(this.elementRef.nativeElement, submittedClass);
      }
    });
  }

  public override registerOnTouched(fn: () => void): void {
    this.onTouched = () => {
      fn();
      this.touched.next();
    };
  }

  public writeValue(value: T): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  public setDisabledState(isDisabled: boolean): void {
    const disabledClass = 'is-disabled';
    this.isDisabled = isDisabled;

    if (isDisabled) {
      this.renderer2.addClass(this.elementRef.nativeElement, disabledClass);
    } else {
      this.renderer2.removeClass(this.elementRef.nativeElement, disabledClass);
    }
  }
}
