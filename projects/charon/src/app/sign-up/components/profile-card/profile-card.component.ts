import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { Profile } from 'decentr-js';

import { svgWallet } from '@shared/svg-icons/wallet';
import { BankService, UserService } from '@core/services';
import { AuthService } from '@core/auth';
import { PDVService } from '@shared/services/pdv';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent implements OnInit {
  public balance$: Observable<string>;
  public banned$: Observable<boolean>;
  public profile$: Observable<Profile>;

  constructor(
    private authService: AuthService,
    private bankService: BankService,
    private pdvService: PDVService,
    private svgIconRegistry: SvgIconRegistry,
    private userService: UserService,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgWallet,
    ]);

    const walletAddress$ = this.authService.getActiveUser().pipe(
      pluck('wallet', 'address'),
    );

    this.balance$ = walletAddress$.pipe(
      switchMap((walletAddress) => this.bankService.getDECBalance(walletAddress)),
    );

    this.profile$ = walletAddress$.pipe(
      switchMap((walletAddress) => this.userService.getProfile(walletAddress)),
    );

    this.banned$ = this.pdvService.getTokenBalance().pipe(
      map((balance) => balance.isBanned),
    );
  }
}
