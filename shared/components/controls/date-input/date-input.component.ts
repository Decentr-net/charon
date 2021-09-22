import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, HostListener,
  OnInit,
  Optional,
  Renderer2, ViewChild,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { createMask } from '@ngneat/input-mask';
import { UntilDestroy } from '@ngneat/until-destroy';

import { isOpenedInTab } from '../../../utils/browser';
import { SubmitSourceDirective } from '../../../directives/submit-source';
import { InputContainerControl } from '../../input-container';
import { CustomControl } from '../custom-control';

@UntilDestroy()
@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [
    {
      provide: InputContainerControl,
      useExisting: DateInputComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInputComponent extends CustomControl<string> implements OnInit {
  @ViewChild('inputElement') public inputElement: ElementRef<HTMLElement>;

  public isOpenedInPopup: boolean = !isOpenedInTab();

  public inputFormat = 'yyyy-mm-dd';

  public dateInputMask = createMask<string>({
    alias: 'datetime',
    inputFormat: this.inputFormat,
    parser: (value: string) => value,
  });

  private isFocused: boolean;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef<HTMLElement>,
    ngControl: NgControl,
    renderer2: Renderer2,
    @Optional() submitSource: SubmitSourceDirective,
  ) {
    super(
      changeDetectorRef,
      elementRef,
      ngControl,
      renderer2,
      submitSource,
    );
  }

  public ngOnInit(): void {
    this.init();
  }

  @HostListener('click')
  public onClick(): void {
    if (this.isFocused || this.isDisabled) {
      return;
    }

    this.inputElement.nativeElement.focus();
  }

  public onFocus(): void {
    this.isFocused = true;
  }

  public onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  public onValueChange(date: string): void {
    this.value = date;
    this.onChange(this.value);
  }
}
