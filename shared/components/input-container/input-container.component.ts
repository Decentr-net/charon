import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Optional
} from '@angular/core';
import { EMPTY, merge, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { SubmitSourceDirective } from '../../directives/submit-source';
import { InputContainerControl } from './input-container-control';

@Component({
  selector: 'app-input-container',
  styleUrls: ['./input-container.component.scss'],
  templateUrl: './input-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputContainerComponent implements AfterContentInit {
  @ContentChild(InputContainerControl) public input: InputContainerControl;

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
      mapTo(true),
    );
  }
}
