import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { isOpenedInTab } from '@shared/utils/browser';
import { svgTransaction } from '@shared/svg-icons/transaction';
import { TokenComplexTransaction } from './token-complex-transaction';

@Component({
  selector: 'app-token-complex-transaction',
  templateUrl: './token-complex-transaction.component.html',
  styleUrls: ['./token-complex-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenComplexTransactionComponent implements OnInit {
  @Input() public transaction: TokenComplexTransaction;

  public isOpenedInPopup = !isOpenedInTab();

  constructor(
    private svgIconRegistry: SvgIconRegistry,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgTransaction,
    ]);
  }
}
