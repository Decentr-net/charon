import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, throwError } from 'rxjs';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { createWalletFromMnemonic } from 'decentr-js';

import { NavigationService } from '@shared/services/navigation/navigation.service';
import { CryptoService } from '@shared/services/crypto';
import { UserService } from '@shared/services/user';
import { AuthService } from '@auth/services';
import { AccountData } from '../../components/account-form';
import { SignUpRoute } from '../../sign-up-route';
import { SignUpStoreService } from '../../services';
import { StatusCodes } from 'http-status-codes';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@ngneat/transloco';
import { SpinnerService } from '@shared/services/spinner/spinner.service';

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

  public activeTab: SignUpTab = SignUpTab.AccountForm;
  public tab: typeof SignUpTab = SignUpTab;

  public seedPhrase: string = CryptoService.generateMnemonic();

  private accountData: AccountData;

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
      case SignUpTab.SeedPhrase: {
        this.switchTab(SignUpTab.AccountForm);
        break;
      }
      default: {
        this.navigationService.getPreviousUrl();
        break;
      }
    }
  }

  public onSubmitAccountForm(accountData: AccountData): void {
    this.accountData = accountData;
    this.switchTab(SignUpTab.SeedPhrase);
  }

  public signUp(): void {
    this.spinnerService.showSpinner();

    const { address: walletAddress, ...keys } = createWalletFromMnemonic(this.seedPhrase);

    from(this.authService.createUser({
      ...this.accountData,
      ...keys,
      walletAddress,
      emailConfirmed: false,
    })).pipe(
      mergeMap(id => this.authService.changeUser(id)),
      mergeMap(() => this.userService.createUser(this.accountData.emails[0], walletAddress)),
      catchError(err => {
        const message = (err.status === StatusCodes.CONFLICT)
          ? this.translocoService.translate('account_form_page.toastr.errors.conflict', null, 'sign-up')
          : this.translocoService.translate('toastr.errors.unknown_error');

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
