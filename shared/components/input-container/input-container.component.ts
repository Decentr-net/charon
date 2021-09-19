import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { EMPTY, merge, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { InputComponent } from '../input';

@Component({
  selector: 'app-input-container',
  styleUrls: ['./input-container.component.scss'],
  templateUrl: './input-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputContainerComponent implements AfterContentInit {
  @ContentChild(InputComponent) public input: InputComponent;

  public showError$: Observable<boolean>;

  constructor(
    @Optional() private form: FormGroupDirective,
  ) {
  }

  public ngAfterContentInit(): void {
    this.showError$ = merge(
      this.form ? this.form.ngSubmit : EMPTY,
      this.input.touched,
    ).pipe(
      mapTo(true),
    );
  }
}
