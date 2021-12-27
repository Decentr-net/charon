import { CORE_API_SERVICES } from './api';
import { BankService } from './bank';
import { BlocksService } from './blocks';
import { DistributionService } from './distribution';
import { FollowingService } from './following';
import { ImageUploaderService } from './image-uploader';
import { NetworkSelectorService } from './network-selector';
import { NetworkService } from './network';
import { PostsService } from './posts';
import { ReferralService } from './referral';
import { SpinnerService } from './spinner';
import { StakingService } from './staking';
import { ThemeService } from './theme';
import { UserService } from './user';

export * from './bank';
export * from './blocks';
export * from './distribution';
export * from './following';
export * from './image-uploader';
export * from './menu';
export * from './network';
export * from './network-selector';
export * from './posts';
export * from './referral';
export * from './spinner';
export * from './staking';
export * from './theme';
export * from './user';

export const CORE_SERVICES = [
  CORE_API_SERVICES,
  BankService,
  BlocksService,
  DistributionService,
  FollowingService,
  ImageUploaderService,
  NetworkSelectorService,
  NetworkService,
  PostsService,
  ReferralService,
  SpinnerService,
  StakingService,
  ThemeService,
  UserService,
];
