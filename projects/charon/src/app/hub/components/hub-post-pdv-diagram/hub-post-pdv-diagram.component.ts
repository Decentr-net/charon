import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgDynamicsNegative } from '@shared/svg-icons/dynamics-negative';
import { svgDynamicsPositive } from '@shared/svg-icons/dynamics-positive';

@Component({
  selector: 'app-hub-post-pdv-diagram',
  templateUrl: './hub-post-pdv-diagram.component.html',
  styleUrls: ['./hub-post-pdv-diagram.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostPdvDiagramComponent {
  @Input() public pdv: number;

  constructor(svgIconRegistry: SvgIconRegistry) {
    svgIconRegistry.register([
      svgDynamicsNegative,
      svgDynamicsPositive,
    ]);
  }

  @HostBinding('class.mod-negative')
  public get isNegative(): boolean {
    return this.pdv < 0;
  }

  @HostBinding('class.mod-positive')
  public get isPositive(): boolean {
    return !this.isNegative;
  }
}
