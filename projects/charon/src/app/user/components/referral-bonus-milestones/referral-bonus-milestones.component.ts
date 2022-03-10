import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { ReferralSenderBonus } from 'decentr-js';

import { svgReferral } from '@shared/svg-icons/referral';
import { svgStar } from '@shared/svg-icons/star';

@Component({
  selector: 'app-referral-bonus-milestones',
  templateUrl: './referral-bonus-milestones.component.html',
  styleUrls: ['./referral-bonus-milestones.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferralBonusMilestonesComponent implements OnInit {
  @Input() public referrals: number;

  @Input() public bonuses: ReferralSenderBonus[];

  constructor(
    private svgIconRegistry: SvgIconRegistry,
  ) {
  }

  public get progress(): number {
    const divider = (this.bonuses || []).length - 1;

    const nextGoalIndex = (this.bonuses || [])
      .findIndex((bonus) => bonus.count > this.referrals);

    const potentialProgress = (nextGoalIndex === -1 ? 1 : (nextGoalIndex / divider)) * 100;

    return Math.max(potentialProgress, 0);
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgReferral,
      svgStar,
    ]);
  }
}
