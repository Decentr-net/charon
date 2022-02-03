import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { SenderRewardLevel } from 'decentr-js';


interface ProgressBarSection {
  width: number;
  to: number;
  reward: number;
}

@Component({
  selector: 'app-referral-reward-milestones',
  templateUrl: './referral-reward-milestones.component.html',
  styleUrls: ['./referral-reward-milestones.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferralRewardMilestonesComponent implements OnChanges {
  @Input() public referrals: number = 0;

  @Input() public rewards: SenderRewardLevel[] = [];

  public sections: ProgressBarSection[];

  public activeSection: ProgressBarSection;

  public progress: number = 0;

  private readonly infiniteSectionWidth = 18;

  private readonly sectionsAvailableSpace = 100 - this.infiniteSectionWidth;

  public ngOnChanges(): void {
    this.sections = this.generateSections(this.rewards);

    this.activeSection = this.sections
      .find((section) => section.to > this.referrals)
      || this.sections[this.sections.length - 1];

    this.progress = this.getProgress(this.sections, this.activeSection, this.referrals);
  }

  private generateSections(rewardLevels: SenderRewardLevel[]): ProgressBarSection[] {
    if (!rewardLevels) {
      return [];
    }

    const maxCountTo = rewardLevels
      .slice()
      .reverse()
      .find((level) => level.to).to;

    return rewardLevels.map((level) => ({
      reward: level.reward,
      to: level.to,
      width: level.to
        ? (level.to - level.from + 1) / maxCountTo * this.sectionsAvailableSpace
        : this.infiniteSectionWidth,
    }));
  }

  private getProgress(sections: ProgressBarSection[], activeSection: ProgressBarSection, referrals: number): number {
    if (!activeSection) {
      return 0;
    }

    if (!activeSection.to) {
      return 100 - this.infiniteSectionWidth / 2;
    }

    const maxCountTo = sections
      .slice()
      .reverse()
      .find((level) => level.to).to;

    return referrals / maxCountTo * this.sectionsAvailableSpace;
  }
}
