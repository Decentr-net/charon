import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TxMessageTypeUrl, Wallet } from 'decentr-js';

import { svgCopy } from '@shared/svg-icons/copy';
import { svgLink } from '@shared/svg-icons/link';
import { svgReceive } from '@shared/svg-icons/receive';
import { svgSend } from '@shared/svg-icons/send';
import { AuthService } from '@core/auth';
import { TokenSingleTransaction, TokenTransactionMessage } from './token-single-transaction';

@Component({
  selector: 'app-token-single-transaction',
  templateUrl: './token-single-transaction.component.html',
  styleUrls: ['./token-single-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenSingleTransactionComponent implements OnInit {
  @Input() public transaction: TokenSingleTransaction | TokenTransactionMessage;

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
