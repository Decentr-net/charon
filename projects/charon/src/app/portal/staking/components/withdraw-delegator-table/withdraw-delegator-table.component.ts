import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from '@angular/core';

import { ValidatorDefinitionShort } from '../../models';

@Component({
  selector: 'app-withdraw-delegator-table',
  templateUrl: './withdraw-delegator-table.component.html',
  styleUrls: ['./withdraw-delegator-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawDelegatorTableComponent {
  @Input() data: ValidatorDefinitionShort[];

  @Input() selectedItems: ValidatorDefinitionShort[] = [];

  @Output() itemClick: EventEmitter<ValidatorDefinitionShort> = new EventEmitter();

  public onItemClick(item: ValidatorDefinitionShort): void {
    this.itemClick.emit(item);
  }

  public trackByAddress: TrackByFunction<ValidatorDefinitionShort> = ({}, { address }) => address;
}
