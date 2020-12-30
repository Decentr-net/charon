import { CORE_API_SERVICES } from './api';
import { MediaService } from './media';
import { NetworkService } from './network';
import { PDVService } from './pdv';
import { PostsService } from './posts';
import { SpinnerService } from './spinner';
import { StateChangesService } from './state';
import { UserService } from './user';

export * from './media';
export * from './menu';
export * from './network';
export * from './pdv';
export * from './posts';
export * from './spinner';
export * from './state';
export * from './user';

export const CORE_SERVICES = [
  CORE_API_SERVICES,
  MediaService,
  NetworkService,
  PDVService,
  PostsService,
  SpinnerService,
  StateChangesService,
  UserService,
];
