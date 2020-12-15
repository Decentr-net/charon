import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { LoginRoute } from '../../login-route';
import { LoginPageService } from './login-page.service';

interface LoginForm {
  password: string;
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [
    LoginPageService,
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
    private activatedRoute: ActivatedRoute,
    private loginPageService: LoginPageService,
    private formBuilder: FormBuilder,
  ) {
  }

  public ngOnInit(): void {
    this.form = this.createForm();
  }

  public onSubmit(): void {
    const passwordControl = this.form.getControl('password');

    const unlocked = this.loginPageService.tryUnlock(passwordControl.value);

    if (!unlocked) {
      passwordControl.setErrors({
        invalid: true,
      });
    }
  }

  private createForm(): FormGroup<LoginForm> {
    return this.formBuilder.group({
      password: ['', [
        Validators.required,
      ]],
    });
  }
}
