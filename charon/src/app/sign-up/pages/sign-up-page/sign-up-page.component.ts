import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, throwError } from 'rxjs';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { StatusCodes } from 'http-status-codes';
import { createWalletFromMnemonic, generateMnemonic } from 'decentr-js';

import { AuthService } from '@core/auth';
import { NavigationService } from '@core/navigation';
import { SpinnerService } from '@core/spinner';
import { UserService } from '@core/services';
import { BaseAccountData } from '../../components';
import { SignUpStoreService } from '../../services';
import { SignUpRoute } from '../../sign-up-route';

enum SignUpTab {
  AccountForm,
  SeedPhrase,
  SeedPhraseTest,
}

@UntilDestroy()
@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public activeTab: SignUpTab = SignUpTab.SeedPhrase;
  public tab: typeof SignUpTab = SignUpTab;

  public seedPhrase: string = generateMnemonic();

  private accountData: BaseAccountData;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private navigationService: NavigationService,
    private router: Router,
    private signUpStoreService: SignUpStoreService,
    private spinnerService: SpinnerService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private userService: UserService,
  ) {
  }

  public navigateBack(): void {
    switch (this.activeTab) {
      case SignUpTab.SeedPhraseTest: {
        this.switchTab(SignUpTab.SeedPhrase);
        break;
      }
      case SignUpTab.AccountForm: {
        this.switchTab(SignUpTab.SeedPhraseTest);
        break;
      }
      default: {
        this.navigationService.back();
        break;
      }
    }
  }

  public onSubmitAccountForm(accountData: BaseAccountData): void {
    this.accountData = accountData;
    this.signUp();
  }

  public signUp(): void {
    this.spinnerService.showSpinner();

    const wallet = createWalletFromMnemonic(this.seedPhrase);

    from(this.authService.createUser({
      wallet,
      password: this.accountData.password,
      primaryEmail: this.accountData.email,
      emailConfirmed: false,
      registrationCompleted: false,
    })).pipe(
      mergeMap(id => this.authService.changeUser(id)),
      mergeMap(() => this.userService.createUser(this.accountData.email, wallet.address)),
      catchError(err => {
        const message = (err.status === StatusCodes.CONFLICT)
          ? this.translocoService.translate('account_form_page.toastr.errors.conflict', null, 'sign-up')
          : this.translocoService.translate('toastr.errors.unknown_error');

        this.authService.logout();
        this.toastrService.error(message);
        return throwError(err);
      }),
      mergeMap(() => this.signUpStoreService.setLastEmailSendingTime()),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(() => this.router.navigate([SignUpRoute.EmailConfirmation], {
      relativeTo: this.activatedRoute,
    }));
  }

  public switchTab(tab: SignUpTab): void {
    this.activeTab = tab;
  }
}
