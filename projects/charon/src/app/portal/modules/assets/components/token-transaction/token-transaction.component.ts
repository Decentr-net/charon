import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TxMessageTypeUrl, Wallet } from 'decentr-js';

import { svgCopy } from '@shared/svg-icons/copy';
import { svgLink } from '@shared/svg-icons/link';
import { svgReceive } from '@shared/svg-icons/receive';
import { svgSend } from '@shared/svg-icons/send';
import { AuthService } from '@core/auth';
import { TokenTransaction, TokenTransactionMessage } from '../token-transactions-table';

@Component({
  selector: 'app-token-transaction',
  templateUrl: './token-transaction.component.html',
  styleUrls: ['./token-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenTransactionComponent implements OnInit {
  @Input() public message: Pick<TokenTransactionMessage, 'amount' | 'recipient' | 'sender' | 'type'>;
  @Input() public transaction: Pick<TokenTransaction, 'comment' | 'fee' | 'hash'>;

  public messageType: typeof TxMessageTypeUrl = TxMessageTypeUrl;

  public walletAddress: Wallet['address'];

  constructor(
    private authService: AuthService,
    private svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgCopy,
      svgLink,
      svgReceive,
      svgSend,
    ]);
  }

  public ngOnInit(): void {
    this.walletAddress = this.authService.getActiveUserInstant().wallet.address;
  }
}
