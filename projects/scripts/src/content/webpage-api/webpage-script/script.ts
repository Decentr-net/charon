import * as commonAPI from './common';
import * as shareAPI from './share';

(window as any).charon = {
  ...commonAPI,
  ...shareAPI,
};
