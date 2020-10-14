import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';

import { AuthService } from '@auth/services';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { LockService } from '@shared/features/lock';
import { LoginRoute } from '../../login-route';
import { AppRoute } from '../../../app-route';

interface LoginForm {
  password: string;
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'login.login_page.form',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  public readonly loginRoute: typeof LoginRoute = LoginRoute;
  public form: FormGroup<LoginForm>;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private lockService: LockService,
    private router: Router,
  ) {
  }

  public get passwordControl(): FormControl<LoginForm['password']> {
    return this.form.getControl('password') as FormControl<LoginForm['password']>;
  }

  public ngOnInit() {
    this.form = this.createForm();
  }

  public onSubmit(): void {
    const isPasswordValid = this.authService.validateCurrentUserPassword(this.passwordControl.value);
    if (!isPasswordValid) {
      this.passwordControl.setErrors({
        invalid: true,
      });
      return;
    }

    this.lockService.unlock();
    this.router.navigate(['/', AppRoute.User]);
  }

  private createForm(): FormGroup<LoginForm> {
    return this.formBuilder.group({
      password: ['', [
        Validators.required,
      ]],
    });
  }
}
