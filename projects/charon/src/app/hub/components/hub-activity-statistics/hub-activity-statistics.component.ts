import { ChangeDetectionStrategy, Component, Input, TrackByFunction } from '@angular/core';

import { ColorCircleLabelColor } from '@shared/components/color-circle-label';
import { DistributionLineParam } from '@shared/components/colored-distribution-line';

export enum HubActivityParam {
  PDV = 'pdv',
}

export enum HubDataValueSource {
  Activity = 'activity',
  Platform = 'platform',
}

export type HubSourceDistribution = Record<HubDataValueSource, number>;

export type HubActivityStatistics = Record<HubActivityParam, HubSourceDistribution>;

interface HubActivityStatisticsRenderParam {
  distribution: DistributionLineParam[];
  paramI18nKey: string;
}

@Component({
  selector: 'app-hub-activity-statistics',
  templateUrl: './hub-activity-statistics.component.html',
  styleUrls: ['./hub-activity-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubActivityStatisticsComponent {
  @Input() public set statistics(statistics: HubActivityStatistics) {
    this.distributions = Object.values(HubActivityParam)
      .map((param) => ({
        paramI18nKey: `params.${param}`,
        distribution: Object.values(HubDataValueSource)
          .map((source) => ({
            color: this.colors[source],
            percent: statistics[param][source],
          })),
      }));
  }

  public distributions: HubActivityStatisticsRenderParam[];

  public readonly dataValueSources = Object.values(HubDataValueSource);

  public readonly colors: Record<HubDataValueSource, DistributionLineParam['color'] & ColorCircleLabelColor> = {
    [HubDataValueSource.Activity]: 'blue',
    [HubDataValueSource.Platform]: 'green',
  };

  public readonly trackByParamI18nKey: TrackByFunction<HubActivityStatisticsRenderParam>
    = ({}, { paramI18nKey }) => paramI18nKey

  public readonly trackBySelf: TrackByFunction<any> = ({}, item) => item;
}
