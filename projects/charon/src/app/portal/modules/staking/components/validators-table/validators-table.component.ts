import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgPiggyBank } from '@shared/svg-icons/piggy-bank';
import { svgUndo } from '@shared/svg-icons/undo';
import { ValidatorDefinition } from '../../models';

@Component({
  selector: 'app-validators-table',
  templateUrl: './validators-table.component.html',
  styleUrls: ['./validators-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidatorsTableComponent {
  @Input() data: ValidatorDefinition[];

  @Output() validatorRewardClick: EventEmitter<ValidatorDefinition> = new EventEmitter();

  @Output() sortClick: EventEmitter<Sort> = new EventEmitter();

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgPiggyBank,
      svgUndo,
    ]);
  }

  public trackByAddress: TrackByFunction<ValidatorDefinition> = ({}, { address }) => address;

  public onValidatorRewardClick(validator: ValidatorDefinition): void {
    this.validatorRewardClick.emit(validator);
  }
}
