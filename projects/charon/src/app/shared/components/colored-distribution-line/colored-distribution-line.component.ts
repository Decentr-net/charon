import { ChangeDetectionStrategy, Component, Input, TrackByFunction } from '@angular/core';

export interface DistributionLineParam {
  color: string;
  percent: number;
}

@Component({
  selector: 'app-colored-distribution-line',
  templateUrl: './colored-distribution-line.component.html',
  styleUrls: ['./colored-distribution-line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColoredDistributionLineComponent {
  @Input() public distribution: DistributionLineParam[];

  public readonly trackByColor: TrackByFunction<DistributionLineParam> = ({}, { color }) => color;
}
