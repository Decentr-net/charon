import { AfterViewInit, Directive } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Directive({
  selector: '[appBindQueryParams]'
})
export class BindQueryParamsDirective implements AfterViewInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private ngControl: ControlContainer,
  ) {
  }

  public ngAfterViewInit(): void {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.ngControl.control.patchValue(queryParams);
  }
}
