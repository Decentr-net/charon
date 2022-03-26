import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import { generateMnemonic } from 'decentr-js';

import { NotificationService } from '@shared/services/notification';
import { AccountData } from '../../components';
import { AppRoute } from '../../../app-route';
import { NavigationService } from '@core/navigation';
import { SpinnerService } from '@core/services';
import { SignUpPageService } from './sign-up-page.service';
import { SignUpRoute } from '../../sign-up-route';

enum SignUpTab {
  AccountForm,
  SeedPhrase,
}

@UntilDestroy()
@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SignUpPageService,
  ],
})
export class SignUpPageComponent implements OnInit {
  public activeTab: SignUpTab = SignUpTab.SeedPhrase;

  public tab: typeof SignUpTab = SignUpTab;

  public seedPhrase: string;

  private accountData: AccountData;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navigationService: NavigationService,
    private ngZone: NgZone,
    private notificationService: NotificationService,
    private router: Router,
    private signUpPageService: SignUpPageService,
    private spinnerService: SpinnerService,
  ) {
  }

  public ngOnInit(): void {
    this.seedPhrase = generateMnemonic();
  }

  public navigateBack(): void {
    switch (this.activeTab) {
      case SignUpTab.AccountForm:
        this.activeTab = SignUpTab.SeedPhrase;
        break;
      default:
        this.navigationService.back([AppRoute.Welcome]);
    }
  }

  public onSubmitAccountForm(accountData: AccountData): void {
    this.accountData = accountData;

    this.signUp();
  }

  public signUp(): void {
    this.spinnerService.showSpinner();

    this.signUpPageService.signUp(this.seedPhrase, {
      primaryEmail: this.accountData.email,
      password: this.accountData.password,
    })
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
      )
      .subscribe({
        next: () => this.ngZone.run(() => {
          this.router.navigate([SignUpRoute.EmailConfirmation], {
            relativeTo: this.activatedRoute,
          });
        }),
        error: (error) => this.notificationService.error(error),
      });
  }

  public switchTab(tab: SignUpTab): void {
    this.activeTab = tab;
  }
}
