import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';
import { merge, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FORM_ERROR_TRANSLOCO_READ } from './form-error.tokens';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorComponent implements OnInit {
  @Input() public control: AbstractControl;
  @Input() public controlName: string;
  @Input() public i18nControlKey: string;

  public translocoRead: string;
  public error$: Observable<{ key: string; params: any }> | null;

  constructor(
    @Optional() private controlContainer: ControlContainer,
    @Inject(FORM_ERROR_TRANSLOCO_READ) public translocoFormScope: string,
  ) {
  }

  public ngOnInit(): void {
    this.translocoRead = `${this.translocoFormScope}.${this.i18nControlKey || this.controlName}.errors`;

    const control = this.control || this.controlContainer.control.get(this.controlName.toString());

    this.error$ = merge(
      control.statusChanges,
      control.valueChanges,
    ).pipe(
      startWith(void 0),
      map(() => {
        if (!control.errors) {
          return null;
        }

        const firstEntry = Object.entries(control.errors)[0];
        return {
          key: firstEntry[0],
          params: firstEntry[1],
        };
      }),
    );
  }
}
