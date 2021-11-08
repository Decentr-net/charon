import { ChangeDetectionStrategy, Component, Input, TrackByFunction } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgCheck } from '@shared/svg-icons/check';
import { ValidatorDefinitionShort } from '../../models';

@Component({
  selector: 'app-withdraw-validator-table',
  templateUrl: './withdraw-validator-table.component.html',
  styleUrls: ['./withdraw-validator-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawValidatorTableComponent {
  @Input() data: ValidatorDefinitionShort[];

  @Input() selectedItems: ValidatorDefinitionShort[] = [];

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgCheck,
    ]);
  }

  public trackByAddress: TrackByFunction<ValidatorDefinitionShort> = ({}, { address }) => address;
}
