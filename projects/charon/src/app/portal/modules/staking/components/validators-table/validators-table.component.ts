import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { Wallet } from 'decentr-js';

import { svgPiggyBank } from '@shared/svg-icons/piggy-bank';
import { ValidatorDefinition } from '../../models';

@Component({
  selector: 'app-validators-table',
  templateUrl: './validators-table.component.html',
  styleUrls: ['./validators-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidatorsTableComponent {
  @Input() data: ValidatorDefinition[];

  @Input() userValidatorAddress: Wallet['validatorAddress'];

  @Output() validatorRewardClick: EventEmitter<ValidatorDefinition> = new EventEmitter();

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgPiggyBank,
    ]);
  }

  public trackByAddress: TrackByFunction<ValidatorDefinition> = ({}, { address }) => address;

  public onValidatorRewardClick(validator: ValidatorDefinition): void {
    this.validatorRewardClick.emit(validator);
  }
}
