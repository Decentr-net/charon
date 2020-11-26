import { CORE_API_SERVICES } from './api';
import { MediaService } from './media';
import { NotificationService } from './notification';
import { SpinnerService } from './spinner';
import { UserService } from './user';

export * from './media';
export * from './notification';
export * from './spinner';
export * from './user';

export const CORE_SERVICES = [
  CORE_API_SERVICES,
  MediaService,
  NotificationService,
  SpinnerService,
  UserService,
];
