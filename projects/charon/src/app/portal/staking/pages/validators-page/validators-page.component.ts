import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ValidatorsPageService } from './validators-page.service';
import { ValidatorDefinition } from './validators-page.definitions';

@Component({
  selector: 'app-validators-page',
  templateUrl: './validators-page.component.html',
  styleUrls: ['./validators-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ValidatorsPageService,
  ],
})
export class ValidatorsPageComponent implements OnInit {
  public validators$: Observable<ValidatorDefinition[]>;

  constructor(
    private validatorsPageService: ValidatorsPageService,
  ) {
  }

  public ngOnInit(): void {
    this.validators$ = this.validatorsPageService.getValidators();
  }
}
