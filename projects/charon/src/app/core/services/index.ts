import { CORE_API_SERVICES } from './api';
import { CurrencyService } from './currency';
import { MediaService } from './media';
import { NotificationService } from './notification';
import { UserService } from './user';

export * from './currency';
export * from './media';
export * from './notification';
export * from './user';

export const CORE_SERVICES = [
  CORE_API_SERVICES,
  CurrencyService,
  MediaService,
  NotificationService,
  UserService,
];
