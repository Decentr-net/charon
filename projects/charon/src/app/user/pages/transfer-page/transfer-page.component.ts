import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Wallet } from 'decentr-js';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { svgClose, svgLogoIcon } from '@shared/svg-icons';
import { TransferPageService } from './transfer-page.service';

interface TransferForm {
  amount: number;
  receiver: Wallet['address'];
}

@UntilDestroy()
@Component({
  selector: 'app-transfer-page',
  templateUrl: './transfer-page.component.html',
  styleUrls: ['./transfer-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TransferPageService,
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'user.transfer_page.form',
    },
  ],
})
export class TransferPageComponent implements OnInit {
  public form: FormGroup<TransferForm>;

  constructor(
    private formBuilder: FormBuilder,
    private transferPageService: TransferPageService,
    private svgIconRegistry: SvgIconRegistry,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgClose,
      svgLogoIcon,
    ]);

    this.form = this.createForm();
  }

  public get canSubmit(): boolean {
    return true;
    // return this.form && this.form.valid;
  }

  public clearReceiver(): void {
    this.form.get('receiver').reset();
  }

  private createForm(): FormGroup<TransferForm> {
    return this.formBuilder.group<TransferForm>({
      amount: [
        0,
        [
          Validators.required,
          Validators.pattern('^\\d*\\.?\\d*$'),
        ],
        [
          this.transferPageService.createAsyncAmountValidator(),
        ],
      ],
      receiver: [
        '',
        [
          Validators.required,
        ],
        [
          this.transferPageService.createAsyncWalletAddressValidator(),
        ],
      ],
    })
  }
}
