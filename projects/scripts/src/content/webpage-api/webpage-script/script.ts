import * as commonAPI from './common';
import * as shareAPI from './share';
import * as swapAPI from './swap';

(window as any).charon = {
  ...commonAPI,
  ...shareAPI,
  ...swapAPI,
};
