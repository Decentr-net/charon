import { ChangeDetectionStrategy, Component, Input, TrackByFunction } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { SentinelSession } from 'decentr-js';

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
  @Input() public nodes: SentinelNodeStatusWithSubscriptions[] | undefined | null;

  @Input() public sessions: SentinelSession[];

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
