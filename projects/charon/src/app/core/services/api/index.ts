import { PingService } from './ping';
import { PostsApiService } from './posts';
import { UserApiService } from './user';

export * from './ping';
export * from './posts';
export * from './user';

export const CORE_API_SERVICES = [
  PingService,
  PostsApiService,
  UserApiService,
];
