export * from './fallback-error-processor';

import { TranslatedErrorProcessor } from './translated-error-processor';

export const ERROR_PROCESSORS = [
  TranslatedErrorProcessor,
];
