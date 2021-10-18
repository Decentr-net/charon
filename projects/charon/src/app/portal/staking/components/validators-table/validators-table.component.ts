import { ChangeDetectionStrategy, Component, Input, TrackByFunction } from '@angular/core';

import { ValidatorDefinition } from '../../models';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { svgPiggyBank } from '@shared/svg-icons/piggy-bank';

@Component({
  selector: 'app-validators-table',
  templateUrl: './validators-table.component.html',
  styleUrls: ['./validators-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidatorsTableComponent {
  @Input() data: ValidatorDefinition[];

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgPiggyBank,
    ]);
  }

  public trackByAddress: TrackByFunction<ValidatorDefinition> = ({}, { address }) => address;
}
