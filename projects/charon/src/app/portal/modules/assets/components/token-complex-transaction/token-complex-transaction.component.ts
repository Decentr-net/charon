import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { TokenTransaction } from '../token-transactions-table';
import { svgTransaction } from '@shared/svg-icons/transaction';

@Component({
  selector: 'app-token-complex-transaction',
  templateUrl: './token-complex-transaction.component.html',
  styleUrls: ['./token-complex-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenComplexTransactionComponent implements OnInit {
  @Input() public transaction: TokenTransaction;

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
