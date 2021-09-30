import { CORE_API_SERVICES } from './api';
import { BankService } from './bank';
import { FollowingService } from './following';
import { ImageUploaderService } from './image-uploader';
import { MediaService } from './media';
import { NetworkSelectorService } from './network-selector';
import { NetworkService } from './network';
import { PostsService } from './posts';
import { ProxyService } from './proxy';
import { SpinnerService } from './spinner';
import { UserService } from './user';

export * from './bank';
export * from './following';
export * from './image-uploader';
export * from './media';
export * from './menu';
export * from './network';
export * from './network-selector';
export * from './posts';
export * from './proxy';
export * from './spinner';
export * from './user';

export const CORE_SERVICES = [
  CORE_API_SERVICES,
  BankService,
  FollowingService,
  ImageUploaderService,
  MediaService,
  NetworkSelectorService,
  NetworkService,
  PostsService,
  ProxyService,
  SpinnerService,
  UserService,
];
