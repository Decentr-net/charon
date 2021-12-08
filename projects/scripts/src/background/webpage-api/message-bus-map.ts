import { PostIdentificationParameters } from 'decentr-js';

import { MessageMap } from '../../../../../shared/message-bus';
import { WebpageAPIMessageCode } from './messages';

export interface WebpageAPIMessageBusMap extends MessageMap {
  [WebpageAPIMessageCode.OpenPost]: {
    body: {
      post: PostIdentificationParameters;
      networkId: string;
    };
    response: {
      error?: Error,
    };
  };
}
