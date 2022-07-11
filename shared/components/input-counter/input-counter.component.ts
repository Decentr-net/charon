import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { map, mergeMap, startWith, takeUntil } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { from, fromEvent, switchMap, timer } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ControlValueAccessor } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgLogoIcon } from '@shared/svg-icons/logo-icon';

@UntilDestroy()
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
export class InputCounterComponent extends ControlValueAccessor<number> implements OnInit {
  @Input() public displayWith: ((value: number) => string) = (value) => value.toString();

  @Input() public max: number | undefined;

  @Input() public min: number = 0;

  @Input() public step: number = 1;

  @ViewChild('incrementRef', { static: true }) public incrementRef: ElementRef<HTMLElement>;

  @ViewChild('decrementRef', { static: true }) public decrementRef: ElementRef<HTMLElement>;

  public value: number = this.min;

  public documentMouseup$ = fromEvent(document, 'mouseup');

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    svgIconRegistry: SvgIconRegistry,
  ) {
    super();

    svgIconRegistry.register([
      svgLogoIcon,
    ]);
  }

  public ngOnInit(): void {
    this.forcePress(this.incrementRef, () => this.increment());
    this.forcePress(this.decrementRef, () => this.decrement());
  }

  private forcePress(elementRef: ElementRef, fn: () => boolean): void {
    fromEvent(elementRef.nativeElement, 'mousedown').pipe(
      switchMap(() => timer(500, 100).pipe(
        startWith(0),
        map((n) => Math.ceil((n + 1) / 3)),
        mergeMap((n) => from(new Array(n))),
        takeUntil(this.documentMouseup$),
      )),
      untilDestroyed(this),
    ).subscribe(() => fn() && this.changeDetectorRef.markForCheck());
  }

  private emitValue(): void {
    if (this.value && this.onChange) {
      this.onChange(this.value);
    }
  }

  public increment(): boolean {
    const potentialValue = this.value + this.step;

    if (this.max && potentialValue > this.max) {
      return false;
    }

    this.value = potentialValue;
    this.emitValue();

    return true;
  }

  public decrement(): boolean {
    const potentialValue = this.value - this.step;

    if (this.min && potentialValue < this.min) {
      return false;
    }

    this.value = potentialValue;
    this.emitValue();

    return true;
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
