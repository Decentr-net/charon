import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { AuthService, AuthUser } from '../../auth';
import { LockService } from '../../lock';
import { PDVService } from '../../services';
import { AppRoute } from '../../../app-route';

@Component({
  selector: 'app-profile-selector',
  templateUrl: './profile-selector.component.html',
  styleUrls: ['./profile-selector.component.scss']
})
export class ProfileSelectorComponent implements OnInit {
  public balance$: Observable<string>;
  public user$: Observable<AuthUser>;

  public readonly appRoute: typeof AppRoute = AppRoute;

  constructor(
    private authService: AuthService,
    private lockService: LockService,
    private pdvService: PDVService,
  ) {
  }

  public ngOnInit(): void {
    this.balance$ = this.pdvService.getBalance().pipe(
      shareReplay(1),
    );

    this.user$ = this.authService.getActiveUser().pipe(
      shareReplay(1),
    );
  }

  public lock(): void {
    this.lockService.lock();
  }
}
