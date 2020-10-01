import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthService } from '@auth/services';
import { SignUpService } from '../../services';
import { SignUpRoute } from '../../sign-up-route';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';

interface CodeForm {
  code: string;
}

@UntilDestroy()
@Component({
  selector: 'app-email-confirmation-page',
  templateUrl: './email-confirmation-page.component.html',
  styleUrls: ['./email-confirmation-page.component.scss'],
  providers: [
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'sign_up.email_confirmation_page.form',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfirmationPageComponent implements OnInit {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public email$: Observable<string>;
  public codeForm: FormGroup<CodeForm>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private signUpService: SignUpService,
  ) {
  }

  public ngOnInit() {
    this.codeForm = this.createForm();

    this.email$ = this.authService.getActiveUser().pipe(
      map(user => user.emails[0]),
    );
  }

  public confirm(): void {
    const code = this.codeForm.getRawValue().code;
    this.signUpService.confirmEmail(code).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.router.navigate(['../', SignUpRoute.Success], {
        relativeTo: this.activatedRoute,
      });
    });
  }

  private createForm(): FormGroup<CodeForm> {
    return this.formBuilder.group({
      code: ['', Validators.required],
    });
  }
}
