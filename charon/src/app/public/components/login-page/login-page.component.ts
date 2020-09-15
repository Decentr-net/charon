import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseSingleFormGroupComponent } from '../../../shared/components/base-single-form-group/base-single-form-group.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent extends BaseSingleFormGroupComponent {

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
