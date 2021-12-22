import { BlockchainNodeService } from '@shared/services/blockchain-node';
import { CurrencyApiService } from './currency';
import { PostsApiService } from './posts';
import { ReferralApiService } from './referral';
import { UserApiService } from './user';

export * from './currency';
export * from './posts';
export * from './referral';
export * from './user';

export const CORE_API_SERVICES = [
  BlockchainNodeService,
  CurrencyApiService,
  PostsApiService,
  ReferralApiService,
  UserApiService,
];
