import { ChangeDetectionStrategy, Component, Input, TrackByFunction } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgCheck } from '@shared/svg-icons/check';
import { ValidatorOperatorDefinitionShort } from '../../models';

@Component({
  selector: 'app-withdraw-validator-table',
  templateUrl: './withdraw-validator-table.component.html',
  styleUrls: ['./withdraw-validator-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawValidatorTableComponent {
  @Input() data: ValidatorOperatorDefinitionShort[];

  @Input() selectedItems: ValidatorOperatorDefinitionShort[] = [];

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgCheck,
    ]);
  }

  public trackByAddress: TrackByFunction<ValidatorOperatorDefinitionShort> = ({}, { address }) => address;
}
