import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgLogoIcon } from '@shared/svg-icons/logo-icon';

@Component({
  selector: 'app-input-counter',
  templateUrl: './input-counter.component.html',
  styleUrls: ['./input-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputCounterComponent,
      multi: true,
    },
  ],
})
export class InputCounterComponent extends ControlValueAccessor<number> {
  @Input() public displayWith: ((value: number) => string) = (value) => value.toString();

  @Input() public max: number | undefined;

  @Input() public min: number = 0;

  @Input() public step: number = 1;

  public value: number = this.min;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    svgIconRegistry: SvgIconRegistry,
  ) {
    super();

    svgIconRegistry.register([
      svgLogoIcon,
    ]);
  }

  private emitValue(): void {
    if (this.value && this.onChange) {
      this.onChange(this.value);
    }
  }

  public increment(): void {
    if (this.max) {
      if (this.value < this.max) {
        this.value = this.value + this.step;
        this.emitValue();
      }
    }

    this.value = this.value + this.step;
    this.emitValue();
  }

  public decrement(): void {
    if (this.value > this.min) {
      this.value = +this.value - this.step;
      this.emitValue();
    }
  }

  public override registerOnChange(fn: (value: (number | null)) => void): void {
    this.onChange = fn;

    this.emitValue();
  }

  public writeValue(value: number) {
    this.value = value || this.min;

    this.changeDetectorRef.detectChanges();
  }
}
