import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgReferral } from '@shared/svg-icons/referral';
import { svgStar } from '@shared/svg-icons/star';
import { ReferralSenderBonus } from '@core/services/api';

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

    const lastGoalReachedIndex = (this.bonuses || [])
      .slice()
      .reverse()
      .findIndex((bonus) => bonus.count <= this.referrals);

    return (lastGoalReachedIndex - 1) / divider * 100;
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgReferral,
      svgStar,
    ]);
  }
}
