import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgJailed } from '../../../../../../../../shared/svg-icons/jailed';

@Component({
  selector: 'app-validator-jailed',
  templateUrl: './validator-jailed.component.html',
  styleUrls: ['./validator-jailed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidatorJailedComponent {
  @HostBinding('class.mod-big')
  @Input() public isBig: boolean;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgJailed,
    ]);
  }
}
