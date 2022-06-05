import { ChangeDetectionStrategy, Component, Input, TrackByFunction } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgCheck } from '@shared/svg-icons/check';
import { SentinelNodeStatusWithSubscriptions } from '@core/services/sentinel';
import { countryNameToCode } from '../../utils/country';

@Component({
  selector: 'app-nodes-expansion',
  templateUrl: './nodes-expansion.component.html',
  styleUrls: ['./nodes-expansion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodesExpansionComponent {
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
