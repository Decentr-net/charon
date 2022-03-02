import { TokenSingleTransaction } from '../token-single-transaction';
import { TokenComplexTransaction } from '../token-complex-transaction';

export type TokenTransaction = TokenSingleTransaction | TokenComplexTransaction;
