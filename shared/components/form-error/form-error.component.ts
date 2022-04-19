import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnInit, Optional } from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';
import { merge, Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

import { FormControlWarn } from '@shared/forms';
import { FORM_ERROR_TRANSLOCO_READ } from './form-error.tokens';

@Component({
  selector: 'app-form-error',
  styleUrls: ['./form-error.component.scss'],
  templateUrl: './form-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorComponent implements OnInit, OnChanges {
  @Input() public control: AbstractControl;

  @Input() public controlName: string;

  @Input() public i18nControlKey: string;

  public translocoRead: string;

  public error$: Observable<{ key: string; params: Record<string, string>, isWarning: boolean } | null>;

  private innerControl: ReplaySubject<AbstractControl | FormControlWarn<any>> = new ReplaySubject(1);

  constructor(
    @Optional() private controlContainer: ControlContainer,
    @Inject(FORM_ERROR_TRANSLOCO_READ) public translocoFormScope: string,
  ) {
  }

  public ngOnChanges(): void {
    this.innerControl.next(this.control || this.controlContainer.control.get(this.controlName.toString()));
  }

  public ngOnInit(): void {
    this.translocoRead = `${this.translocoFormScope}.${this.i18nControlKey || this.controlName}.errors`;

    this.error$ = this.innerControl.pipe(
      switchMap((control) => merge(
        control.statusChanges,
        control.valueChanges,
      ).pipe(
        startWith(0),
        map(() => control),
      )),
      map((control) => {
        if (control.errors) {
          const [errorKey, errorValue] = Object.entries(control.errors)[0];

          return {
            key: errorKey,
            params: errorValue,
            isWarning: false,
          };
        }

        if (control instanceof FormControlWarn && control.warnings) {
          const [warningKey, warningValue] = Object.entries(control.warnings)[0];

          return {
            key: warningKey,
            params: warningValue,
            isWarning: true,
          };
        }

        return null;
      }),
      distinctUntilChanged(),
    );
  }
}
