import { PostsApiService } from './posts';
import { UserApiService } from './user';

export * from './posts';
export * from './user';

export const CORE_API_SERVICES = [
  PostsApiService,
  UserApiService,
];
