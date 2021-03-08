import { PingService } from '@shared/services/ping';
import { BankApiService } from './bank';
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
  FollowingApiService,
  ImageApiService,
  PingService,
  PostsApiService,
  UserApiService,
];
