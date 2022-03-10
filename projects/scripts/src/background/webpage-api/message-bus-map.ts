import { Post } from 'decentr-js';

import { MessageMap } from '../../../../../shared/message-bus';
import { NetworkId } from '../../../../../shared/services/configuration';
import { WebpageAPIMessageCode } from './messages';

export interface WebpageAPIMessageBusMap extends MessageMap {
  [WebpageAPIMessageCode.OpenExtension]: {
    body: undefined;
    response: undefined;
  };
  [WebpageAPIMessageCode.OpenPost]: {
    body: {
      post: Pick<Post, 'owner' | 'uuid'>;
      networkId: NetworkId;
    };
    response: {
      error?: Error,
    };
  };
  [WebpageAPIMessageCode.Unlock]: {
    body: undefined;
    response: undefined;
  };
}
