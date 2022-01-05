import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { Profile } from 'decentr-js';

import { svgWallet } from '@shared/svg-icons/wallet';
import { BankService, UserService } from '@core/services';
import { AuthService } from '@core/auth';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent implements OnInit {
  public balance$: Observable<string>;

  public profile$: Observable<Profile>;

  constructor(
    private authService: AuthService,
    private bankService: BankService,
    private svgIconRegistry: SvgIconRegistry,
    private userService: UserService,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgWallet,
    ]);

    this.balance$ = this.bankService.getDECBalance();

    this.profile$ = this.authService.getActiveUserAddress().pipe(
      switchMap((walletAddress) => this.userService.getProfile(walletAddress)),
    );
  }
}
