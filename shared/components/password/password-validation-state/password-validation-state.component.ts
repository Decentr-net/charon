import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgCheck } from '../../../svg-icons/check';
import { svgClosed } from '../../../svg-icons/closed';
import { PasswordTranslationsConfig } from '../password.definitions';
import { PASSWORD_VALIDATION_CONFIG } from '../password.module';
import { getPasswordState, PasswordValidationConfig, PasswordValidationState } from '../validation';

@Component({
  selector: 'app-password-validation-state',
  styleUrls: ['./password-validation-state.component.scss'],
  templateUrl: './password-validation-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordValidationStateComponent implements OnInit {
  @Input() public translationsConfig: PasswordTranslationsConfig;

  @Input() public set password(value: string) {
    this.state = getPasswordState(value, this.passwordValidationConfig);
  }

  public state: PasswordValidationState;

  constructor(
    private svgIconRegistry: SvgIconRegistry,
    @Inject(PASSWORD_VALIDATION_CONFIG) public passwordValidationConfig: PasswordValidationConfig,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgCheck,
      svgClosed,
    ]);
  }
}
