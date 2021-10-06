import { ChangeDetectionStrategy, Component, Input, TrackByFunction } from '@angular/core';

import { ValidatorDefinition } from '../../pages/validators-page/validators-page.definitions';

@Component({
  selector: 'app-validators-table',
  templateUrl: './validators-table.component.html',
  styleUrls: ['./validators-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidatorsTableComponent {
  @Input() data: ValidatorDefinition[];

  public trackByAddress: TrackByFunction<ValidatorDefinition> = ({}, { address }) => address;
}
