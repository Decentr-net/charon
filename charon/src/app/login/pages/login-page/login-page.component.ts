import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BaseSingleFormGroupComponent } from '../../../shared/components/base-single-form-group/base-single-form-group.component';
import { LoginRoute } from '../../login-route';
import { AuthService, LockService } from '../../../auth/services';
import { AppRoute } from '../../../app-route';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent extends BaseSingleFormGroupComponent implements OnInit {
  public readonly loginRoute: typeof LoginRoute = LoginRoute;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private lockService: LockService,
    private router: Router,
  ) {
    super();
  }

  public get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  public ngOnInit() {
    this.form = this.createForm();
  }

  public onSubmit(): void {
    const isPasswordValid = this.authService.validateCurrentUserPassword(this.passwordControl.value);
    if (!isPasswordValid) {
      this.passwordControl.setErrors({
        invalidPassword: true,
      });
      return;
    }

    this.lockService.unlock();
    this.router.navigate(['/', AppRoute.User]);
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      password: [null, Validators.required]
    });
  }
}
