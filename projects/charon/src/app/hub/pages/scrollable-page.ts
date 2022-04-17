import { ElementRef } from '@angular/core';
import { timer } from 'rxjs';

export abstract class ScrollablePage {
  protected constructor(protected elementRef: ElementRef<HTMLElement>) {
  }

  public setScrollTop(value: number): void {
    timer(0)
      .subscribe(() => this.elementRef.nativeElement.scrollTop = value || 0);
  }
}
