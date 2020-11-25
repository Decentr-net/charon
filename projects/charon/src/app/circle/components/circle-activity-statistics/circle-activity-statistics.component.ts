import { ChangeDetectionStrategy, Component, Input, TrackByFunction } from '@angular/core';

import { ColorCircleLabelColor } from '@root-shared/components/color-circle-label';
import { DistributionLineParam } from '@shared/components/colored-distribution-line';

export enum CircleActivityParam {
  PDV = 'pdv',
}

export enum CircleDataValueSource {
  Activity = 'activity',
  Platform = 'platform',
}

export type CircleSourceDistribution = Record<CircleDataValueSource, number>;

export type CircleActivityStatistics = Record<CircleActivityParam, CircleSourceDistribution>;

interface CircleActivityStatisticsRenderParam {
  distribution: DistributionLineParam[];
  paramI18nKey: string;
}

@Component({
  selector: 'app-circle-activity-statistics',
  templateUrl: './circle-activity-statistics.component.html',
  styleUrls: ['./circle-activity-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleActivityStatisticsComponent {
  @Input() public set statistics(statistics: CircleActivityStatistics) {
    this.distributions = Object.values(CircleActivityParam)
      .map((param) => ({
        paramI18nKey: `params.${param}`,
        distribution: Object.values(CircleDataValueSource)
          .map((source) => ({
            color: this.colors[source],
            percent: statistics[param][source],
          })),
      }));
  }

  public distributions: CircleActivityStatisticsRenderParam[];

  public readonly dataValueSources = Object.values(CircleDataValueSource);

  public readonly colors: Record<CircleDataValueSource, DistributionLineParam['color'] & ColorCircleLabelColor> = {
    [CircleDataValueSource.Activity]: 'blue',
    [CircleDataValueSource.Platform]: 'green',
  };

  public readonly trackByParamI18nKey: TrackByFunction<CircleActivityStatisticsRenderParam>
    = ({}, { paramI18nKey }) => paramI18nKey

  public readonly trackBySelf: TrackByFunction<any> = ({}, item) => item;
}
