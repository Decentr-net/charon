import { CurrencyApiService } from './currency';
import { PostsApiService } from './posts';
import { UserApiService } from './user';

export * from './currency';
export * from './posts';
export * from './user';

export const CORE_API_SERVICES = [
  CurrencyApiService,
  PostsApiService,
  UserApiService,
];
