import { Post } from 'decentr-js';

import { MessageMap } from '../../../../../shared/message-bus';
import { WebpageAPIMessageCode } from './messages';

export interface WebpageAPIMessageBusMap extends MessageMap {
  [WebpageAPIMessageCode.OpenPost]: {
    body: {
      post: Pick<Post, 'owner' | 'uuid'>;
      networkId: string;
    };
    response: {
      error?: Error,
    };
  };
}
