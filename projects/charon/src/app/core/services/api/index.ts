import { BankApiService } from './bank';
import { BlockchainNodeService } from '@shared/services/blockchain-node';
import { FollowingApiService } from './following';
import { ImageApiService } from './image';
import { PostsApiService } from './posts';
import { UserApiService } from './user';

export * from './bank';
export * from './following';
export * from './image';
export * from './posts';
export * from './user';

export const CORE_API_SERVICES = [
  BankApiService,
  BlockchainNodeService,
  FollowingApiService,
  ImageApiService,
  PostsApiService,
  UserApiService,
];
