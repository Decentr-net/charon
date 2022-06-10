import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgCheck } from '@shared/svg-icons/check';
import { countryNameToCode } from '../../utils/country';
import { SentinelNodeStatusWithSubscriptions } from '@shared/models/sentinel';

@Component({
  selector: 'app-nodes-expansion',
  templateUrl: './nodes-expansion.component.html',
  styleUrls: ['./nodes-expansion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodesExpansionComponent {
  @Output() public sessionEnded: EventEmitter<void> = new EventEmitter();

  @Output() public sessionStarted: EventEmitter<void> = new EventEmitter();

  @Output() public subscribedToNode: EventEmitter<void> = new EventEmitter();

  @Input() public nodes: SentinelNodeStatusWithSubscriptions[] | undefined | null;

  public countryNameToCode = countryNameToCode;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgCheck,
    ]);
  }

  public trackByAddress: TrackByFunction<SentinelNodeStatusWithSubscriptions> = ({}, { address }) => address;
}
