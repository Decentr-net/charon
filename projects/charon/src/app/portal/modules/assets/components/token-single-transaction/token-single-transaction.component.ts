import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TxMessageTypeUrl } from 'decentr-js';

import { svgCopy } from '@shared/svg-icons/copy';
import { svgLink } from '@shared/svg-icons/link';
import { svgReceive } from '@shared/svg-icons/receive';
import { svgSend } from '@shared/svg-icons/send';
import { TokenSingleTransaction } from './token-single-transaction';

@Component({
  selector: 'app-token-single-transaction',
  templateUrl: './token-single-transaction.component.html',
  styleUrls: ['./token-single-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenSingleTransactionComponent {
  @Input() public transaction: TokenSingleTransaction;

  public messageType: typeof TxMessageTypeUrl = TxMessageTypeUrl;

  constructor(
    private svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgCopy,
      svgLink,
      svgReceive,
      svgSend,
    ]);
  }
}
