import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
  selector: 'input[appNumeric]',
})
export class NumericDirective implements OnInit {
  @Input('appNumeric') public enabled: boolean = true;

  private previousValue: string;

  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
  ) {
  }

  public ngOnInit(): void {
    fromEvent(this.elementRef.nativeElement, 'keydown').pipe(
      untilDestroyed(this),
    ).subscribe((event: KeyboardEvent) => {
      this.onKeydown(event);
      this.previousValue = this.getValue();
    });
  }

  @HostListener('input')
  public onInput(): void {
    if (!this.enabled) {
      return;
    }

    let value = this.getValue();
    const valueMatch = new RegExp(/[0-9.]+/).exec(value);
    value = valueMatch ? valueMatch[0] : '';

    if ([null, ''].includes(value)) {
      return;
    }

    if (value === '0' && this.previousValue === '0.') {
      this.setValue('');

      return;
    }

    if (['0', '.'].some((key) => key === value)) {
      this.setValue('0.');

      return;
    }

    if (value.endsWith('.')) {
      return;
    }

    this.setValue(value);
  }

  public onKeydown(event: KeyboardEvent): void {
    if (!this.enabled) {
      return;
    }

    const { key, keyCode } = event;
    const value = this.getValue();

    if (key === '.') {
      if (value.includes('.')) {
        event.preventDefault();
      }

      return;
    }

    if ([46, 8, 9, 27, 13, 110].includes(keyCode)) {
      return;
    }

    if ((event.ctrlKey || event.metaKey) && [65, 67, 86, 88].includes(keyCode)) {
      return;
    }

    if (keyCode >= 35 && keyCode <= 39) {
      return;
    }

    if (+key >= 0 && +key <= 9) {
      return;
    }

    event.preventDefault();
  }

  private getValue(): string {
    return this.elementRef.nativeElement.value;
  }

  private setValue(value: number | string): void {
    this.elementRef.nativeElement.value = value.toString();
  }
}
