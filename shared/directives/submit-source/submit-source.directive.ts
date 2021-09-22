import { Directive, Host } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Observable } from 'rxjs';

@Directive({
  selector: 'form[appSubmitSource]',
})
export class SubmitSourceDirective {
  constructor(@Host() private formGroupDirective: FormGroupDirective) {
  }

  public get statusChanges(): Observable<string> {
    return this.formGroupDirective.statusChanges;
  }

  public get ngSubmit(): Observable<void> {
    return this.formGroupDirective.ngSubmit;
  }

  public get submitted(): boolean {
    return this.formGroupDirective.submitted;
  }
}
