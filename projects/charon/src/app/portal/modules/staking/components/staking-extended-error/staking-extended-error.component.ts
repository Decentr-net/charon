import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-staking-extended-error',
  styleUrls: ['./staking-extended-error.component.scss'],
  templateUrl: './staking-extended-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StakingExtendedErrorComponent {
  @Input() public icon: string;

  @Input() public title: string;

  @Input() public text: string;

  @Input() public availableTime: number;
}
