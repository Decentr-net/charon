import * as commonAPI from './common';
import * as shareAPI from './share';
import * as swapAPI from './swap';

type WindowWithCharonAPI = Window & typeof global & {
  charon: unknown;
};

(window as WindowWithCharonAPI).charon = {
  ...commonAPI,
  ...shareAPI,
  ...swapAPI,
};
