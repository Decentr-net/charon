import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthService, AuthUser } from '../../auth';
import { LockService } from '../../lock';
import { PDVService } from '../../services';
import { AppRoute } from '../../../app-route';

@UntilDestroy()
@Component({
  selector: 'app-profile-selector',
  templateUrl: './profile-selector.component.html',
  styleUrls: ['./profile-selector.component.scss']
})
export class ProfileSelectorComponent implements OnInit {
  public balance: string;
  public user$: Observable<AuthUser>;

  public readonly appRoute: typeof AppRoute = AppRoute;

  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private lockService: LockService,
    private pdvService: PDVService,
  ) {
  }

  public ngOnInit(): void {
    this.pdvService.getBalance().pipe(
      untilDestroyed(this),
    ).subscribe((balance) => {
      this.balance = balance;
      this.changeDetectorRef.detectChanges();
    });

    this.user$ = this.authService.getActiveUser().pipe(
      shareReplay(1),
    );
  }

  public lock(): void {
    this.lockService.lock();
  }
}
