import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Optional,
} from '@angular/core';
import { EMPTY, merge, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SubmitSourceDirective } from '../../directives/submit-source';
import { FormErrorComponent } from '../form-error';
import { InputContainerControl } from './input-container-control';

@UntilDestroy()
@Component({
  selector: 'app-input-container',
  styleUrls: ['./input-container.component.scss'],
  templateUrl: './input-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputContainerComponent implements AfterContentInit {
  @ContentChild(InputContainerControl) public input: InputContainerControl;

  @ContentChild(FormErrorComponent) public formError: FormErrorComponent;

  public showError$: Observable<boolean>;

  constructor(
    @Optional() private submitSource: SubmitSourceDirective,
  ) {
  }

  public ngAfterContentInit(): void {
    this.showError$ = merge(
      this.submitSource ? this.submitSource.ngSubmit : EMPTY,
      this.input?.touched || EMPTY,
    ).pipe(
      map(() => true),
    );

    this.formError?.error$.pipe(
      filter(() => !!this.input),
      map((error) => error?.isWarning),
      untilDestroyed(this),
    ).subscribe((hasWarningError) => {
      this.input.hasWarningError = hasWarningError;
    });
  }
}
