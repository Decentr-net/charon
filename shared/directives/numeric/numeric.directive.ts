import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appNumeric]',
})
export class NumericDirective {
  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
  ) {
  }

  @HostListener('keydown', ['$event'])
  public onKeydown(event: KeyboardEvent): void {
    const { key, keyCode } = event;

    if (key === '.') {
      const value = this.getValue();
      if (!value) {
        this.setValue(0);
        return;
      }

      if (value.includes('.')) {
        const newValue = parseInt(value.replace('.', ''));
        this.setValue(newValue);
      }

      return;
    }

    if ([46, 8, 9, 27, 13, 110].includes(keyCode)) {
      return;
    }

    if ((event.ctrlKey || event.metaKey) && [65, 67, 88].includes(keyCode)) {
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

  @HostListener('paste', ['$event'])
  public onPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }

  private getValue(): string {
    return this.elementRef.nativeElement.value;
  }

  private setValue(value: number | string): void {
    this.elementRef.nativeElement.value = value.toString();
  }
}
