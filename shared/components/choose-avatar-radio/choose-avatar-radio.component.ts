import { AfterViewInit, ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from 'rxjs';

import { USER_AVATARS } from '../avatar';

@Component({
  selector: 'app-choose-avatar-radio',
  templateUrl: './choose-avatar-radio.component.html',
  styleUrls: ['./choose-avatar-radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ChooseAvatarRadioComponent,
      multi: true,
    },
  ],
})
export class ChooseAvatarRadioComponent implements AfterViewInit, ControlValueAccessor {
  public avatars: string[] = USER_AVATARS;
  public value: string;

  protected propagateChange: (_: any) => void = noop;
  protected propagateTouch: () => void = noop;

  public ngAfterViewInit(): void {
    this.value = this.value || this.avatars[0];
    this.onChange();
  }

  public onChange(): void {
    this.propagateChange(this.value);
    this.propagateTouch();
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }
}
