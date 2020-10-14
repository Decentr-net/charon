import { Component } from '@angular/core';

import { LockService } from '@shared/features/lock';

@Component({
  selector: 'app-profile-selector',
  templateUrl: './profile-selector.component.html',
  styleUrls: ['./profile-selector.component.scss']
})
export class ProfileSelectorComponent {

  constructor(
    private lockService: LockService,
  ) { }

  public lock(): void {
    this.lockService.lock();
  }

}
