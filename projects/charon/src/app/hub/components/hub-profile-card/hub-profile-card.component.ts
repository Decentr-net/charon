import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PublicProfile, Wallet } from 'decentr-js';

export interface HubProfile extends Pick<PublicProfile, 'avatar' | 'firstName' | 'lastName'> {
  walletAddress: Wallet['address'];
}

@Component({
  selector: 'app-hub-profile-card',
  templateUrl: './hub-profile-card.component.html',
  styleUrls: ['./hub-profile-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubProfileCardComponent {
  @Input() profile: HubProfile;
}
