import { TokenComplexTransactionComponent } from './token-complex-transaction';
import { TokenSingleTransactionComponent } from './token-single-transaction';
import { TokenTransactionActionsComponent } from './token-transaction-actions';
import { TokenTransactionAmountComponent } from './token-transaction-amount';
import { TokenTransactionsTableComponent } from './token-transactions-table';

export const ASSETS_COMPONENTS = [
  TokenComplexTransactionComponent,
  TokenSingleTransactionComponent,
  TokenTransactionActionsComponent,
  TokenTransactionAmountComponent,
  TokenTransactionsTableComponent,
];

export * from './token-complex-transaction';
export * from './token-single-transaction';
export * from './token-transactions-table';
