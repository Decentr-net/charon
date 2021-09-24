import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnInit, Optional } from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';
import { merge, Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, mapTo, startWith, switchMap } from 'rxjs/operators';

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
  public error$: Observable<{ key: string; params: any }> | null;

  private innerControl: ReplaySubject<AbstractControl> = new ReplaySubject(1);

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
        startWith(void 0),
        mapTo(control),
      )),
      map((control) => {
        if (!control.errors) {
          return null;
        }

        const firstEntry = Object.entries(control.errors)[0];
        return {
          key: firstEntry[0],
          params: firstEntry[1],
        };
      }),
      distinctUntilChanged(),
    );
  }
}
