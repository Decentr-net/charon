import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { BaseSingleFormGroupComponent } from '../../../shared/components/base-single-form-group/base-single-form-group.component';
import { FORM_ERROR_TRANSLOCO_READ } from '../../../shared/components/form-error';
import { LoginRoute } from '../../login-route';

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
export class LoginPageComponent extends BaseSingleFormGroupComponent {
  public readonly loginRoute: typeof LoginRoute = LoginRoute;

  constructor(formBuilder: FormBuilder) {
    super();

    this.form = formBuilder.group({
      password: [null, Validators.required]
    });
  }

  onSubmit() {
    // TODO: add service
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }
}
