import { BankApiService } from './bank';
import { BlocksApiService } from './blocks';
import { CurrencyApiService } from './currency';
import { BlockchainNodeService } from '@shared/services/blockchain-node';
import { DistributionApiService } from './distribution';
import { FollowingApiService } from './following';
import { ImageApiService } from './image';
import { PostsApiService } from './posts';
import { ReferralApiService } from './referral';
import { StakingApiService } from './staking';
import { UserApiService } from './user';

export * from './bank';
export * from './blocks';
export * from './currency';
export * from './distribution';
export * from './following';
export * from './image';
export * from './posts';
export * from './referral';
export * from './staking';
export * from './user';

export const CORE_API_SERVICES = [
  BankApiService,
  BlocksApiService,
  BlockchainNodeService,
  CurrencyApiService,
  DistributionApiService,
  FollowingApiService,
  ImageApiService,
  PostsApiService,
  ReferralApiService,
  StakingApiService,
  UserApiService,
];
