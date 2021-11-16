import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { TokenTransaction, TokenTransactionMessage, TokenTransactionMessageType } from '../token-transactions-table';
import { svgCopy } from '@shared/svg-icons/copy';
import { svgLink } from '@shared/svg-icons/link';
import { svgReceive } from '@shared/svg-icons/receive';
import { svgSend } from '@shared/svg-icons/send';

@Component({
  selector: 'app-token-transaction',
  templateUrl: './token-transaction.component.html',
  styleUrls: ['./token-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenTransactionComponent {
  @Input() public message: Pick<TokenTransactionMessage, 'amount' | 'recipient' | 'sender' | 'type'>;
  @Input() public transaction: Pick<TokenTransaction, 'comment' | 'fee' | 'hash'>;

  public messageType: typeof TokenTransactionMessageType = TokenTransactionMessageType;

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
