import { BroadcastErrorProcessor } from './broadcast-error-processor';
import { TranslatedErrorProcessor } from './translated-error-processor';

export * from './fallback-error-processor';

export const ERROR_PROCESSORS = [
  BroadcastErrorProcessor,
  TranslatedErrorProcessor,
];
