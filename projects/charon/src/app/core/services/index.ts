import { BlockchainNodeService } from '@shared/services/blockchain-node';
import { BankService } from './bank';
import { BlocksService } from './blocks';
import { CurrencyService } from './currency';
import { DecentrService } from './decentr';
import { DistributionService } from './distribution';
import { FollowingService } from './following';
import { HelpService } from './help';
import { ImageUploaderService } from './image-uploader';
import { NetworkSelectorService } from './network-selector';
import { NetworkService } from './network';
import { PDVService } from './pdv';
import { PostsService } from './posts';
import { ReferralService } from './referral';
import { SentinelService } from './sentinel';
import { SpinnerService } from './spinner';
import { StakingService } from './staking';
import { UserService } from './user';

export * from './bank';
export * from './blocks';
export * from './currency';
export * from './decentr';
export * from './distribution';
export * from './following';
export * from './image-uploader';
export * from './help';
export * from './menu';
export * from './network';
export * from './network-selector';
export * from './pdv';
export * from './posts';
export * from './referral';
export * from './sentinel';
export * from './spinner';
export * from './staking';
export * from './user';

export const CORE_SERVICES = [
  BankService,
  BlockchainNodeService,
  BlocksService,
  DecentrService,
  CurrencyService,
  DistributionService,
  FollowingService,
  HelpService,
  ImageUploaderService,
  NetworkSelectorService,
  NetworkService,
  PDVService,
  PostsService,
  ReferralService,
  SentinelService,
  SpinnerService,
  StakingService,
  UserService,
];
