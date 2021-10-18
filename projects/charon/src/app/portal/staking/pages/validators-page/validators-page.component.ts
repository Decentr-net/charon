import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl } from '@ngneat/reactive-forms';
import { ValidatorStatus } from 'decentr-js';

import { DistributionService } from '@core/services/distribution';
import { ValidatorDefinition } from '../../models';
import { ValidatorsPageService } from './validators-page.service';

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

  public totalDelegatorRewards$: Observable<number>;

  public onlyBondedFormControl: FormControl<boolean> = new FormControl(false);

  constructor(
    private distributionService: DistributionService,
    private validatorsPageService: ValidatorsPageService,
  ) {
  }

  public ngOnInit(): void {
    this.validators$ = combineLatest([
      this.validatorsPageService.getValidators(),
      this.onlyBondedFormControl.value$,
    ]).pipe(
      map(([validators, onlyBonded]) => {
        return validators.filter(({ status }) => !onlyBonded || status === ValidatorStatus.Bonded);
      }),
    );

    this.totalDelegatorRewards$ = this.distributionService.getTotalDelegatorRewards();
  }
}
