import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';

export class LocalControlErrorStateMatcher implements ErrorStateMatcher {
    constructor(private localControl: AbstractControl) {
    }

    isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;

        if (this.localControl) {
            control = this.localControl;
        }

        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
