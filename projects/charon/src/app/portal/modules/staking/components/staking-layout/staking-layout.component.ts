import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

import { isOpenedInTab } from '@shared/utils/browser';

@UntilDestroy()
@Component({
  selector: 'app-staking-layout',
  templateUrl: './staking-layout.component.html',
  styleUrls: ['./staking-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StakingLayoutComponent {
  @Input() public contentDivider = false;

  @HostBinding('class.mod-bordered') public hasBorder: boolean = isOpenedInTab();
}
