import { Directive, ElementRef, OnInit } from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { FormGroupDirective } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { filter, switchMap, take, takeWhile } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
  selector: 'form[appSubmitAfterValidation]',
})
export class SubmitAfterValidationDirective implements OnInit {
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private formGroupDirective: FormGroupDirective,
  ) {
  }

  public ngOnInit(): void {
    fromEvent(this.elementRef.nativeElement, 'keydown').pipe(
      filter((event: KeyboardEvent) => this.formGroupDirective.valid && event.keyCode === ENTER),
      switchMap(() => this.formGroupDirective.statusChanges.pipe(
        takeWhile((status) => status !== 'INVALID'),
        filter((status) => status === 'VALID'),
        take(1),
      )),
      untilDestroyed(this),
    ).subscribe(() => this.formGroupDirective.ngSubmit.emit());
  }
}
