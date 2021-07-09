import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { PublicProfile } from 'decentr-js';

import { svgFollow } from '@shared/svg-icons/follow';
import { svgTopup } from '@shared/svg-icons/topup';

export interface HubProfile extends PublicProfile {
  isFollowing: boolean;
  isFollowingUpdating: boolean;
  isUserProfile: boolean;
  postsCount: number;
}

@Component({
  selector: 'app-hub-profile-card',
  templateUrl: './hub-profile-card.component.html',
  styleUrls: ['./hub-profile-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubProfileCardComponent {
  @Input() public profile: HubProfile;

  @Output() public readonly follow: EventEmitter<boolean> = new EventEmitter();

  @Output() public readonly topUp: EventEmitter<void> = new EventEmitter();

  constructor(svgIconRegistry: SvgIconRegistry) {
    svgIconRegistry.register([
      svgFollow,
      svgTopup,
    ]);
  }

  public onFollow(): void {
    if (this.profile.isFollowingUpdating) {
      return;
    }

    this.follow.emit(!this.profile.isFollowing);
  }

  public onTopUp(): void {
    this.topUp.emit();
  }
}
