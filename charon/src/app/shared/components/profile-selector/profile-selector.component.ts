import { Component, OnInit } from '@angular/core';

import { LockService } from '@shared/features/lock';
import { AuthService } from '@auth/services';
import { UserService } from '@shared/services/user';
import { Environment } from '@environments/environment.definitions';
import { PDVService } from '../../../../../../shared/services/pdv';
import { from, Observable } from 'rxjs';
import { map, pluck, shareReplay } from 'rxjs/operators';
import { exponentialToFixed } from '@shared/utils/number';
import { ProfileSelectorService } from '@shared/components/profile-selector/profile-selector.service';

@Component({
  selector: 'app-profile-selector',
  templateUrl: './profile-selector.component.html',
  styleUrls: ['./profile-selector.component.scss']
})
export class ProfileSelectorComponent implements OnInit {
  public balance$: Observable<string>;
  public username$: Observable<string>;

  constructor(
    private authService: AuthService,
    private lockService: LockService,
    private profileSelectorService: ProfileSelectorService,
  ) {
  }

  public ngOnInit() {
    this.balance$ = this.profileSelectorService.getBalance().pipe(
      shareReplay(1),
    );

    this.username$ = this.authService.getActiveUser().pipe(
      pluck('primaryUsername'),
      shareReplay(1),
    );
  }

  public lock(): void {
    this.lockService.lock();
  }
}
