import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-token-transaction-amount',
  templateUrl: './token-transaction-amount.component.html',
  styleUrls: ['./token-transaction-amount.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenTransactionAmountComponent {
  @Input() public amount: number | string;

  @HostBinding('class')
  public get colorClass(): string {
    return +this.amount >= 0 ? 'color-positive' : 'color-negative';
  }
}
