import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck, shareReplay } from 'rxjs/operators';

import { AuthService } from '../../auth';
import { LockService } from '../../lock';
import { ProfileSelectorService } from '../profile-selector.service';
import { CircleRoute } from '../../../circle/circle-route';
import { AppRoute } from '../../../app-route';

@Component({
  selector: 'app-profile-selector',
  templateUrl: './profile-selector.component.html',
  styleUrls: ['./profile-selector.component.scss']
})
export class ProfileSelectorComponent implements OnInit {
  public balance$: Observable<string>;
  public username$: Observable<string>;
  public userAvatar;

  public readonly appRoute: typeof AppRoute = AppRoute;

  constructor(
    private authService: AuthService,
    private lockService: LockService,
    private profileSelectorService: ProfileSelectorService,
  ) {
  }

  public ngOnInit(): void {
    this.balance$ = this.profileSelectorService.getBalance().pipe(
      shareReplay(1),
    );

    this.username$ = this.authService.getActiveUser().pipe(
      pluck('primaryUsername'),
      shareReplay(1),
    );

    this.userAvatar = this.authService.getActiveUserInstant().avatar;
  }

  public lock(): void {
    this.lockService.lock();
  }
}
